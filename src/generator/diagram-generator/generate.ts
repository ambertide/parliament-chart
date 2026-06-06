import { readFile, writeFile } from "fs/promises";
import { calculateSeatCoords } from "./arch-chart-generator";
import { PartyRecord, RepresentativeRecord } from "../parlevent";

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
  const generatedData = Object.fromEntries(Object.entries(sourcedData).map(([term, termData]) => (
    [
      term,
      Object.fromEntries(Object.entries(termData).map(
        ([milestoneIndex, milestoneData]) => {
          const {
            snapshot: {
              representatives: individualRepresentatives,
              parties
            },
            ...rest
          } = milestoneData;
          // Now calculate for each sort case.
          const snapshot = ['deputies' as const, 'alliance' as const].reduce((accum, groupBy) => (
            { ...accum,
              [groupBy]: calculateSeatCoords({
                individualRepresentatives,
                groupBy,
                numberOfRepresentatives: 600,
                parties
              })
            }),
          {}
          );
          // 
          return [
            milestoneIndex,
            {
              snapshot,
              ...rest
            }
          ];
        }
      )
      )
    ]
  )));
  const jsonString = JSON.stringify(generatedData, undefined, 4);
  await writeFile('./src/assets/data.generated.json', jsonString);
};