import { generateFromSourcedData } from "./diagram-generator";
import { fetchAndSource } from "./fetch";
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from "fs";
import { ExportedMilestones } from "./fetch";

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
  if (!existsSync('tmp')) {
    await mkdir('tmp');
  }
  const fileContents = `
export const events = ${JSON.stringify(events, undefined, 2)};
export const milestones = ${JSON.stringify(milestones, undefined, 2)};
export const chartData = ${JSON.stringify(chartData, undefined, 2)};
  `
  await writeFile('tmp/generated.js', fileContents);
  console.log("Emitted events data");
}

const emitTypeDeclarations = async () => {
  if (!existsSync('dist')) {
    await mkdir('dist');
  }
  const fileContents = `
import { ExportedMilestones, Parlevent, ChartData } from "./types";

export const events: Parlevent;
export const milestones: ExportedMilestones;
export const chartData: ChartData;
  `
  await writeFile('dist/bundle.d.ts', fileContents);
  console.log("Emitted main type declarations");
}


await generateFile();
await emitTypeDeclarations();

