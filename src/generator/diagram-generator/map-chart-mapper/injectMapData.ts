import { IndividualRepresentative, Representative } from "@/types";
import { extractMapSlots } from "./extractMapSlots";
import { matchMapToSeats } from "./matchMapToSeats";

/**
 * Given the chart data with the representative map locations missing
 * calculate where in the map they should go and inject that information
 * to the representative record.
 * @param chartData Chart data to fill in with info.
 * @param individualReperesentatives List of individual representatives.
 * @returns The filled in chart data.
 */
export const injectMapData = async (
  // This one hold representations of the reps in the chart data
  chartData: Omit<Representative, 'mapLocation'>[],
  // this one holds actual representative data
  individualReperesentatives: IndividualRepresentative[] 
): Promise<Representative[]> => {
  const slots = await extractMapSlots();
  return matchMapToSeats(slots, chartData, individualReperesentatives);
};