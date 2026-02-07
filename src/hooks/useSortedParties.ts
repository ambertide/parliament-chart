/* eslint-disable @typescript-eslint/no-explicit-any */
import { Party } from "@/types";
import { useMemo } from "react";

export function sortAndGroupParties(parties: Party[], sortAndGroupBy: 'deputies' | 'alliance' | 'groups', flatten: true): Party[];
export function sortAndGroupParties(parties: Party[], sortAndGroupBy: 'deputies', flatten: false): Party[]
export function sortAndGroupParties(parties: Party[], sortAndGroupBy: 'alliance' | 'groups', flatten: false): [string, Party[]][]
export function sortAndGroupParties(
  parties: Party[],
  sortAndGroupBy: 'deputies' | 'groups' | 'alliance',
  flatten = true
): [string, Party[]][] | Party[] {
  switch (sortAndGroupBy) {
    case "deputies":
      // Certain parties are represented twice, this is required because
      // Saadet for instance has both members in, and outside, the New Path
      // parliamentary group.
      return Object.values(
        Object.groupBy(parties, ({ partyName }) => partyName)
      )
        .map((partyInstances) => {
          // Array of party instances
          return partyInstances?.reduce((accum, current) => ({
            ...accum,
            deputyCount: accum.representativeCount + current.representativeCount
          }));
        })
        .toSorted((a, b) => (a?.representativeCount ?? 0) - (b?.representativeCount ?? 0))
        .toReversed() as Party[];
    case "groups":
      const groupedByGroups = Object.entries(
        Object.groupBy(parties, ({ groupName }) => groupName)
      )
        .map<[string, Party[]]>(([categoryName, subslice]) => ([
          categoryName,
          sortAndGroupParties(subslice as Party[], "deputies", true) as Party[]
        ]))
        .toSorted(([_, a], [__, b]) => {
          // This time, sort by total deputies elected from that group
          const aSum = a.reduce(
            (runningTotal, current) => current.representativeCount + runningTotal,
            0
          );
          const bSum = b.reduce(
            (runningTotal, current) => current.representativeCount + runningTotal,
            0
          );
          return aSum - bSum;
        })
        .toReversed();
      if (flatten) {
        return groupedByGroups.flatMap(([_, parties]) => parties) as Party[];
      }
      return groupedByGroups;
    case "alliance":
      const groupedByAlliance = Object.entries(
        Object.groupBy(parties, ({ allianceName }) => allianceName)
      )
        .map<[string, Party[]]>(([alliance, subslice]) => [
          alliance,
          sortAndGroupParties(subslice as Party[], "deputies", true) as Party[]
        ])
        .toSorted(([_, a], [__, b]) => {
          // This time, sort by total deputies elected from that electoral
          // alliance
          const aSum = a.reduce(
            (runningTotal, current) => current.representativeCount + runningTotal,
            0
          );
          const bSum = b.reduce(
            (runningTotal, current) => current.representativeCount + runningTotal,
            0
          );
          return aSum - bSum;
        })
        .toReversed();
      if (flatten) {
        return groupedByAlliance.flatMap(([_, f]) => f);
      }
      return groupedByAlliance;
    default:
      return [];
  }
};

const swapIndependentsAndVacants = (parties: Party[]): Party[] => {
  const vacant = parties.find(({ partyName }) => partyName === "Vacant");
  const independents = parties.find(({ partyName }) => partyName === "Ind.");
  return [
    ...parties.filter(
      ({ partyName }) => !["Ind.", "Vacant"].includes(partyName)
    ),
    independents,
    vacant
  ].filter(e => e) as Party[];
};


type CommonProps = {
  parties: Party[],
};

type FlattenedProps = CommonProps & {
  flatten: true,
  groupBy: 'deputies' | 'alliance' | 'groups',
};

type UnflattenedPartyOutput = CommonProps & {
  flatten: false,
  groupBy: 'deputies'
};

type UnflattenedGroupOutput = CommonProps & {
  flatten: false,
  groupBy: 'alliance' | 'groups'
}

type TotalProps = UnflattenedGroupOutput | UnflattenedPartyOutput | FlattenedProps;

export function useSortedParties(p: FlattenedProps): Party[];
export function useSortedParties(p: UnflattenedPartyOutput): Party[];
export function useSortedParties(p: UnflattenedGroupOutput): [string, Party[]]
export function useSortedParties({
  parties,
  groupBy,
  flatten 
}: TotalProps): [string, Party[]] | Party[] {
  return useMemo(
    () => {
      if (!flatten && ['alliance', 'groups'].includes(groupBy)) {
        return sortAndGroupParties(
          parties as any,
          groupBy as any,
          flatten as any
        );
      }
      return swapIndependentsAndVacants(
        sortAndGroupParties(
          parties as any,
          groupBy as any,
          flatten as any
        )
      )
    },
    [parties, groupBy, flatten]
  )
}
