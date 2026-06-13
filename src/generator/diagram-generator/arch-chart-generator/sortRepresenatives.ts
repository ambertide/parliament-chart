import { Party, Representative } from "@/types";
import { sortParties } from "./sortParties";

export type PreSortRepresentative = Omit<Representative, 'party' | 'clockwise' | 'counterClockwise' | 'mapLocation'> & { angle: number, distanceFromCentre: number};
type RepsByParty = Record<
  string,
  {
    representative: Omit<Representative, 'mapLocation'>,
    angle: number,
    distanceFromCentre: number
  }[]
>;


type SortRepresentatives = (p:{
  parties: Party[],
  groupBy: 'deputies' | 'groups' | 'alliance',
  representatives: PreSortRepresentative[]
}) => {
  representatives: Omit<Representative, 'mapLocation'>[],
  sortedParties: Party[],
  repsByParty: RepsByParty
};

const sortSeats = (representatives: PreSortRepresentative[]) => (
  representatives.sort(
    (
      {angle: tA, distanceFromCentre: rA},
      {angle: tB, distanceFromCentre: rB}
    ) => (
      tA !== tB
        ? (tA - tB)
        : (rA - rB)
    )).toReversed()
);

/**
 * Sort the representatives and the parties.
 */
export const sortRepresentatives: SortRepresentatives = ({
  parties,
  groupBy,
  representatives
}) => {
  const sortedRepresentatives = sortSeats(representatives);
  const sortedParties = sortParties({ parties, groupBy, flatten: true });
  let currentPartyIndex = 0;
  const repsUpdated: Omit<Representative, 'mapLocation'>[] = [];
  const repsClone = [...sortedRepresentatives];
  const representativesByParty: RepsByParty = {};
  for (const { representativeCount, partyColor: color, partyName, ...otherPartyProps } of sortedParties) {
    representativesByParty[partyName] = [];
    const dataAttributesToAdd = sortedParties.flatMap(
      ({ partyName }, partyIndex) =>
        currentPartyIndex == partyIndex
          ? []
          : currentPartyIndex > partyIndex
            ? [
              {
                partyName,
                rotateOnSelect: "clockwise" as 'clockwise' | 'counterClockwise'
              }
            ]
            : [
              {
                partyName,
                rotateOnSelect: "counterClockwise" as 'clockwise' | 'counterClockwise'
              }
            ]
    );

    for (let _ = 0; _ < representativeCount; _++) {
      const { location, angle, distanceFromCentre, id } = repsClone.pop() as PreSortRepresentative;
      const counterClockwise = dataAttributesToAdd
        .filter(({ partyName: pName }) => pName !== partyName)
        .filter(({ rotateOnSelect }) => rotateOnSelect === 'counterClockwise')
        .map(({ partyName }) => `[${partyName}]`)
        .join('');
      const clockwise = dataAttributesToAdd
        .filter(({ partyName: pName }) => pName !== partyName)
        .filter(({ rotateOnSelect }) => rotateOnSelect === 'clockwise')
        .map(({ partyName }) => `[${partyName}]`)
        .join('');
      
      const newRepresentative = {
        location,
        party: {
          representativeCount,
          partyColor: color,
          partyName,
          ...otherPartyProps
        },
        clockwise,
        counterClockwise,
        id
      };
      repsUpdated.push(newRepresentative);
      representativesByParty[partyName].push({ representative: newRepresentative, angle, distanceFromCentre });
    }
    currentPartyIndex++;
  }
  return {
    representatives: repsUpdated,
    repsByParty: representativesByParty,
    sortedParties
  };
};