import { generateFromSourcedData } from "./diagram-generator";
import { fetchAndSource } from "./fetch";

export const fetchAndGenerate = async () => {
  await fetchAndSource();
  console.log('Fetched data.');
  await generateFromSourcedData();
  console.log('Outputted the data generated.');
};

fetchAndGenerate();
