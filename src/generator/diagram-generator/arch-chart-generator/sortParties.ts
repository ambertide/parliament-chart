/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vacancy } from "@/generator/parlevent/types";
import { Party } from "@/types";

export function sortAndGroupParties(parties: Party[], sortAndGroupBy: 'deputies' | 'alliance' , flatten: true): Party[];
export function sortAndGroupParties(parties: Party[], sortAndGroupBy: 'deputies', flatten: false): Party[];
export function sortAndGroupParties(parties: Party[], sortAndGroupBy: 'alliance', flatten: false): [string, Party[]][];
export function sortAndGroupParties(
  parties: Party[],
  sortAndGroupBy: 'deputies' | 'alliance',
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
  const vacants = parties.find(({ partyName}) => partyName === "Boş");
  const independents = parties.find(({ partyName }) => partyName === "Bağımsız");
  return [
    ...parties.filter(
      ({ partyName }) => !["Boş", "Bağımsız"].includes(partyName)
    ),
    independents,
    vacants
  ].filter(e => e) as Party[];
};


type CommonProps = {
  parties: Party[],
  vacancies: Vacancy[]
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
};

type TotalProps = UnflattenedGroupOutput | UnflattenedPartyOutput | FlattenedProps;

const injectVacancies = (parties: Party[], vacancies: Vacancy[]): Party[] => {
  const vacants = vacancies.length > 0 ? [{
    partyName: "Boş",
    partyColor: "#111111",
    groupName: "",
    allianceName: "",
    representativeCount: vacancies.length
  } satisfies Party] : [];
  return [
    ...parties,
    ...vacants
  ];
};

export function sortParties(p: FlattenedProps): Party[];
export function sortParties(p: UnflattenedPartyOutput): Party[];
export function sortParties(p: UnflattenedGroupOutput): [string, Party[]];
export function sortParties({
  parties: partiesWOVacancies,
  groupBy,
  flatten,
  vacancies
}: TotalProps): [string, Party[]] | Party[] {
  
  const parties = injectVacancies(partiesWOVacancies, vacancies);
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
  );
}
