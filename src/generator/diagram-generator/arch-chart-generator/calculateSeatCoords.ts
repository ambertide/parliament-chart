import { IndividualRepresentative, Party, Representative} from "@/types";
import { calculateRotatedCoordinates } from "./calculateRotatedCoordinates";
import {
  sortRepresentatives,
  type PreSortRepresentative,
} from "./sortRepresenatives";
import { sortParties } from "./sortParties";

const RADII = 2.5;

const OPTIMAL_DISTANCE = RADII * 4;

const SVG_VIEWPORT_DIMENSIONS = {
  WIDTH: 552,
  HEIGHT: 323
};

const CHART_CENTRE = {
  X: SVG_VIEWPORT_DIMENSIONS.WIDTH / 2,
  Y: SVG_VIEWPORT_DIMENSIONS.HEIGHT * 0.825
};

const START_DISTANCE = 80; 


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
 * @param numberOfDelegates Number of delegates seated in that
 * term of the parliament, *INCLUDING* vacancies.
 * @returns An array of representatives.
 */
const calculateRepsForSection = (
  globalAngleModifier: number,
  startDistance: number,
  rowCount: number,
  sliceAngle: number,
  seatsPerRow: Record<number, number>,
  earlyStop = false,
  earlyStopModifier = -1,
  numberOfDelegates = 600,
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
          x: CHART_CENTRE.X,
          y: CHART_CENTRE.Y - radiusThisRow,
        };
        const rotatedMPPoint = calculateRotatedCoordinates({
          angleOfRotation: currentAngle,
          pointO: mpPoint,
          canvasPivotPointO: {
            x: CHART_CENTRE.X,
            y: CHART_CENTRE.Y,
          },
        });
        reps.push({
          location: rotatedMPPoint,
          angle: currentAngle,
          distanceFromCentre: radiusThisRow,
        });
      }
    }
  }
  if (earlyStop) {
    // Delete the last 4
    // or, like, 54, westministerial era had
    // 550 MPs, in theory we will remove more
    // as ministers sat somewhere else.
    const originalLength = reps.length;
    for (
      let toRemove = 1 + earlyStopModifier;
      toRemove < 608 - numberOfDelegates + earlyStopModifier;
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
  return (
    [-2, -1, 0, 1, 2]
      // Convert to radian angles.
      .map((multiplier) => (multiplier * Math.PI) / 5)
      // Then calculate and merge into an array.
      .flatMap((globalAngleModifier) =>
        calculateRepsForSection(
          globalAngleModifier,
          START_DISTANCE,
          7,
          35 * (Math.PI / 180),
          frontBenchSeatsPerRow,
        ),
      )
  );
};

const calculateBackBenches = (numberOfRepresentatives = 600) => {
  const backBenchSeatsPerRow = [6, 6, 6, 8, 8];
  const stepAngle = Math.PI / 20;
  let reps: PreSortRepresentative[] = [];
  for (let step = 0; step < 5; step++) {
    for (const direction of [-1, 1]) {
      const globalAngleModifier = (2 * step + 1) * stepAngle * direction;
      const repsThisLoop = calculateRepsForSection(
        globalAngleModifier,
        START_DISTANCE + OPTIMAL_DISTANCE * 8,
        5,
        19 * (Math.PI / 180),
        backBenchSeatsPerRow,
        step == 4,
        direction < 0 ? 1 : 0,
        numberOfRepresentatives,
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
        const distanceH = START_DISTANCE + col * OPTIMAL_DISTANCE;
        const distanceV = row * OPTIMAL_DISTANCE + OPTIMAL_DISTANCE / 4;
        const location = {
          x: CHART_CENTRE.X + direction * distanceH,
          y: CHART_CENTRE.Y + distanceV,
        };
        if (direction > 0) {
          reps.push({
            location,
            angle: Math.PI / 2 + 0.1 * (row + 1),
            distanceFromCentre: distanceH,
          });
        } else {
          // For left
          reps.push({
            location,
            angle: -Math.PI / 2 - 0.1 * (row + 1),
            distanceFromCentre: distanceH,
          });
        }
      }
    }
  }
  return reps;
};

/**
 * Calculate the bench coordinates for
 * handling the graph driving.
 * @param numberOfRepresentatives Number of representatives to draw for.
 * @returns 
 */
const calculateBenches = (numberOfRepresentatives = 600) =>
  [
    calculateBackBenches,
    calculateFrontBenches,
    calculateFrontRectangularBenches,
  ].flatMap((calculationFunction) =>
    calculationFunction(numberOfRepresentatives),
  );

type CalculateSeatCoords = (p: {
  parties: Party[];
  groupBy: "deputies" | "alliance";
  numberOfRepresentatives: number;
  individualRepresentatives: IndividualRepresentative[];
}) => {
  representatives: Omit<Representative, 'mapLocation'>[];
  sortedParties: Party[] | [string, Party[]][];
};

export const calculateSeatCoords: CalculateSeatCoords = ({
  parties,
  groupBy,
  numberOfRepresentatives,
}) => {
  const preSortRepresentatives = calculateBenches(numberOfRepresentatives);
  const { representatives } =
    sortRepresentatives({
      parties,
      groupBy,
      representatives: preSortRepresentatives,
    });
  const sortedParties = sortParties({
    parties,
    flatten: groupBy === 'deputies' as any,
    groupBy 
  });
  return {
    representatives,
    sortedParties,
  };
};
