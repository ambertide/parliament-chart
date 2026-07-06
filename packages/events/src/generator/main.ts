import { generateFromSourcedData } from "./diagram-generator";
import { fetchAndSource } from "./fetch";
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from "fs";

export const fetchAndGenerate = async () => {
  const { events, exportedMilestones } = await fetchAndSource();
  const generatedData = await generateFromSourcedData({ milestones: exportedMilestones});
  return {
    events: events.events,
    milestones: exportedMilestones,
    chartData: generatedData
  }
};



const generateFile = async () => {
  const { events, milestones, chartData } = await fetchAndGenerate();
  const fileContents = `
    import type { Parlevent } from 'generator/parlevent';

    type Milestones = {
      [term: string]: {
        [milestone: string]: {
          snapshot: {
            representatives: {
              name: string,
              party: string,
              endOfTermStatus: string,
              partyColor: string,
              term: number,
              province: string
            }[],
            parties: {
              partyName: string,
              partyColor: string,
              groupName: string,
              allianceName: string,
              representativeName: string
            }[],
            vacancies: {
              term: string,
              province: string,
              lastOfficeHolder: {
                name: string,
                party: string,
                endOfTermStatus: string,
                partyColor: string,
                term: number,
                province: string
              },
              officeVacatedEvent: {
                date: string,
                action: string,
                actor: string,
                metadata: {
                  reason: string
                },
                source: string,
                target: string
              }
            }[]
          },
          date: string,
          slug: string,
          description: string
        }
      }
    }

    export const events: Parlevent[] = ${JSON.stringify(events)};
    export const milestones: Milestones = ${JSON.stringify(milestones)};
    export const chartData: any = ${JSON.stringify(chartData)};
  `
  await writeFile('src/generated.ts', fileContents);
}

await generateFile();
