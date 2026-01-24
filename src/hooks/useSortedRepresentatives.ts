import { Party, Representative } from "@/types";
import { useSortedParties } from "./useSortedParties";

export type PreSortRepresentative = Omit<Representative, 'party' | 'clockwise' | 'counterClockwise'> & { angle: number, distanceFromCentre: number};
type RepsByParty = Record<
  string,
  {
    representative: Representative,
    angle: number,
    distanceFromCentre: number
  }[]
>;


type UseSortedRepresentatives = (p:{
  parties: Party[],
  groupBy: 'deputies' | 'groups' | 'alliance',
  representatives: PreSortRepresentative[]
}) => {
  representatives: Representative[],
  sortedParties: Party[],
  repsByParty: RepsByParty
}

const sortRepresentatives = (representatives: PreSortRepresentative[]) => (
  representatives.sort(
    (
      {angle: tA, distanceFromCentre: rA},
      {angle: tB, distanceFromCentre: rB}
    ) => (
      tA !== tB
        ? (tA - tB)
        : (rA - rB)
    )).toReversed()
)

/**
 * Sort the representatives and the parties.
 */
export const useSortedRepresentatives: UseSortedRepresentatives = ({
  parties,
  groupBy,
  representatives
}) => {
  const sortedRepresentatives = sortRepresentatives(representatives)
  const sortedParties = useSortedParties({ parties, groupBy, flatten: true });
  let currentPartyIndex = 0;
  const repsUpdated: Representative[] = [];
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
      const { location, angle, distanceFromCentre } = repsClone.pop() as PreSortRepresentative;
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
        counterClockwise
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
  }
}