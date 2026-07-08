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
    mkdir('tmp');
  }
  const fileContents = `
const events = ${JSON.stringify(events, undefined, 2)};
const milestones = ${JSON.stringify(milestones, undefined, 2)};
const chartData = ${JSON.stringify(milestones, undefined, 2)};

export default {
  events,
  milestones,
  chartData
};
  `
  await writeFile('tmp/generated.js', fileContents);
}

await generateFile();
