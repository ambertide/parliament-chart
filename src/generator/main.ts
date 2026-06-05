import { generateFromSourcedData } from "./diagram-generator";
import { fetchAndSource } from "./fetch";

export const fetchAndGenerate = async () => {
  // await fetchAndSource();
  const data = await generateFromSourcedData();
  console.log(data);
};

fetchAndGenerate();