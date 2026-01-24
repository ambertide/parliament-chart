import { Party, Representative } from "@/types"
import { calculateRotatedCoordinates } from "./useRotatedCoordinates";
import { useSortedRepresentatives, type PreSortRepresentative } from './useSortedRepresentatives';

const OPTIMAL_DISTANCE = 15;

/**
 * Calculate the multipliers for the rotational transforms
 * ie for 2 points you have 1 rotation, for 4 points you have
 * 2, etc.
 */
const getRotationSteps = (pointCount: number) => [0, pointCount / 2];

/**
 * Calculate the coordinate for reps for a specific section.
 *
 * @param globalAngleModifier Rotation for the section the MP is in.
 * @param startDistance Start distance of the section from centre.
 * @param rowCount Count of rows in section
 * @param sliceAngle Angle of the slice
 * @param seatsPerRow Seats per each "row" of the slice.
 * @param earlyStop Should we stop early? ie: for the last slices.
 * @param earlyStopModifier Where to stop from, from right or left.
 * @returns An array of representatives.
 */
const calculateRepsForSection = (
  globalAngleModifier: number,
  startDistance: number,
  rowCount: number,
  sliceAngle: number,
  seatsPerRow: Record<number, number>,
  earlyStop = false,
  earlyStopModifier = -1
): PreSortRepresentative[] => {
  const reps: PreSortRepresentative[] = [];
  for (let row = 0; row < rowCount; row++) {
    const seatsThisRow = seatsPerRow[row];
    const radiusThisRow = startDistance + OPTIMAL_DISTANCE * row;

    const rotationMultipliersThisRow = getRotationSteps(seatsThisRow);
    const [start, stop] = rotationMultipliersThisRow;
    // This is the rotation of the centre point of this arc to be in the
    // right place.
    for (let step = start; step < stop; step++) {
      // Step is the index of rotation.
      for (const directionMultiplier of [-1, 1]) {
        // This is symetrical so we have two dimensions.
        const stepLength = (0.5 * sliceAngle) / (seatsThisRow + 1);
        const localAngle = (2 * step + 1) * stepLength * directionMultiplier;
        const currentAngle = localAngle + globalAngleModifier;
        const mpPoint = {
          x: 400,
          y: 350 - radiusThisRow
        };
        const rotatedMPPoint = calculateRotatedCoordinates({
          angleOfRotation: currentAngle,
          pointO: mpPoint,
          canvasPivotPointO: {
            x: 400,
            y: 350
          }
        });
        reps.push({
          location: rotatedMPPoint,
          angle: currentAngle,
          distanceFromCentre: radiusThisRow
        });
      }
    }
  }
  if (earlyStop) {
    // Delete the last 4
    const originalLength = reps.length;
    for (
      let toRemove = 1 + earlyStopModifier;
      toRemove < 8 + earlyStopModifier;
      toRemove += 2
    ) {
      reps.splice(originalLength - toRemove, 1);
    }
  }
  return reps;
};

/**
 * Draw the front facing benches
 */
const calculateFrontBenches = (): PreSortRepresentative[] => {
  const frontBenchSeatsPerRow = [4, 4, 6, 6, 8, 10, 10];
  return [-2, -1, 0, 1, 2]
    // Convert to radian angles.
    .map(multiplier => multiplier * Math.PI / 5)
    // Then calculate and merge into an array.
    .flatMap(
      globalAngleModifier => (
        calculateRepsForSection(
          globalAngleModifier,
          120,
          7,
          35 * (Math.PI / 180),
          frontBenchSeatsPerRow
        )
      )
    )
};

const calculateBackBenches = () => {
  const backBenchSeatsPerRow = [6, 6, 6, 8, 8];
  const stepAngle = Math.PI / 20;
  let reps: PreSortRepresentative[] = [];
  for (let step = 0; step < 5; step++) {
    for (const direction of [-1, 1]) {
      const globalAngleModifier = (2 * step + 1) * stepAngle * direction;
      const repsThisLoop = calculateRepsForSection(
        globalAngleModifier,
        120 + OPTIMAL_DISTANCE * 8,
        5,
        19 * (Math.PI / 180),
        backBenchSeatsPerRow,
        step == 4,
        direction < 0 ? 1 : 0
      );
      reps = [...reps, ...repsThisLoop];
    }
  }
  return reps;
};

/**
 * Turkish parliamanet has extra front benches in rectangular configuration.
 */
const calculateFrontRectangularBenches = () => {
  const reps: PreSortRepresentative[] = [];
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 2; row++) {
      for (const direction of [-1, 1]) {
        const distanceH = 120 + col * OPTIMAL_DISTANCE;
        const distanceV = row * OPTIMAL_DISTANCE + OPTIMAL_DISTANCE / 4;
        const location = {
          x: 400 + direction * distanceH,
          y: 350 + distanceV
        };
        if (direction > 0) {
          reps.push({
            location,
            angle: Math.PI / 2 + 0.1 * (row + 1),
            distanceFromCentre: distanceH
          });
        } else {
          // For left
          reps.push({
            location,
            angle: -Math.PI / 2 - 0.1 * (row + 1),
            distanceFromCentre: distanceH
          });
        }
      }
    }
  }
  return reps;
};

const calculateBenches = () => (
  [
    calculateBackBenches,
    calculateFrontBenches,
    calculateFrontRectangularBenches
  ].flatMap(
    calculationFunction => calculationFunction()
  )
)


type UseCalculateDiagramCircles = ((p: {
  parties: Party[],
  groupBy: 'deputies' | 'groups' | 'alliance'
}) => {
  representatives: Representative[],
  sortedParties: Party[] | [string, Party[]][]
})

export const useCalculateDiagramCircles: UseCalculateDiagramCircles = ({
  parties,
  groupBy
}) => {
  const preSortRepresentatives = calculateBenches();
  const {
    representatives,
    repsByParty,
    sortedParties
  } = useSortedRepresentatives({
    parties,
    groupBy,
    representatives: preSortRepresentatives
  });
  return {
    representatives,
    sortedParties
  }
}