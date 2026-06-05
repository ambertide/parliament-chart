import { readFile } from "fs/promises";
import { calculateSeatCoords } from "./arch-chart-generator";
import { PartyRecord, RepresentativeRecord } from "../parlevent";
import { Representative } from "@/types";

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

type ChartData = {
  [term: string]: {
    [milestoneName: string]: {
      snapshot: {
        // Add an aditional layer for sort method
        // this changes the arch diag so it is necessary
        // to include it.
        [sortMethod: string] : {
          chartData: Representative[]
          sortedParties: PartyRecord[],
        }
      }
      date: string,
      slug: string
    }
  }
};

/**
 * Take the sourced data and convert it into chart data.
 */
export const generateFromSourcedData = async (): Promise<ChartData> => {
  const sourcedData: SourcedData = JSON.parse((await readFile('src/assets/milestones.json')).toString());
  return Object.fromEntries(Object.entries(sourcedData).map(([term, termData]) => (
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
};