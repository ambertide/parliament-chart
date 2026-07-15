
import { calculateSeatCoords } from "./arch-chart-generator";
import { PartyRecord, RepresentativeRecord } from "../parlevent";
import { injectMapData } from "./map-chart-mapper";
import { Vacancy } from "../parlevent/types";

type SourcedData = {
  [term: string]: {
    [milestoneName: string]: {
      snapshot: {
        representatives: RepresentativeRecord[],
        parties: PartyRecord[],
        vacancies: Vacancy[]
      },
      date: string,
      slug: string
    }
  }
};

/**
 * Take the sourced data and convert it into chart data.
 */
export const generateFromSourcedData = async ({ milestones }: { milestones: SourcedData}): Promise<void> => {
  const sourcedData = milestones;
  const generatedData = Object.fromEntries(await Promise.all(Object.entries(sourcedData).map(async ([term, termData]) => (
    [
      term,
      Object.fromEntries(await Promise.all(
        Object.entries(termData).map(
          async ([milestoneIndex, milestoneData]) => {
            const {
              snapshot: {
                representatives: individualRepresentatives,
                parties,
                vacancies
              },
              ...rest
            } = milestoneData;
            // Now calculate for each sort case.
            const snapshot = ['deputies' as const, 'alliance' as const].reduce(
              async (accum, groupBy) => {
                const { representatives, sortedParties} = calculateSeatCoords({
                  individualRepresentatives,
                  groupBy,
                  numberOfRepresentatives: 600,
                  parties,
                  vacancies
                });
                return (
                  { ...await accum,
                    [groupBy]: {
                      sortedParties,
                      // Also fill in the map locations here as well
                      representatives: await injectMapData(representatives, individualRepresentatives, vacancies)
                    }
                  });
              },
              Promise.resolve({})
            );
            // 
            return [
              milestoneIndex,
              {
                snapshot: await snapshot,
                ...rest
              }
            ];
          }
        ))
      )
    ]
  ))));
  return generatedData;
};
