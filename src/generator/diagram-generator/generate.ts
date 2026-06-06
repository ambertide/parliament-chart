import { readFile, writeFile } from "fs/promises";
import { calculateSeatCoords } from "./arch-chart-generator";
import { PartyRecord, RepresentativeRecord } from "../parlevent";
import { injectMapData } from "./map-chart-mapper";

type SourcedData = {
  [term: string]: {
    [milestoneName: string]: {
      snapshot: {
        representatives: RepresentativeRecord[],
        parties: PartyRecord[]
      },
      date: string,
      slug: string
    }
  }
};

/**
 * Take the sourced data and convert it into chart data.
 */
export const generateFromSourcedData = async (): Promise<void> => {
  const sourcedData: SourcedData = JSON.parse((await readFile('src/assets/milestones.json')).toString());
  const generatedData = Object.fromEntries(await Promise.all(Object.entries(sourcedData).map(async ([term, termData]) => (
    [
      term,
      Object.fromEntries(await Promise.all(
        Object.entries(termData).map(
          async ([milestoneIndex, milestoneData]) => {
            const {
              snapshot: {
                representatives: individualRepresentatives,
                parties
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
                  parties
                });
                return (
                  { ...await accum,
                    [groupBy]: {
                      sortedParties,
                      // Also fill in the map locations here as well
                      representatives: await injectMapData(representatives, individualRepresentatives)
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
  const jsonString = JSON.stringify(generatedData, undefined, 4);
  await writeFile('./src/assets/data.generated.json', jsonString);
};