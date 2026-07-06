import { readFile } from "fs/promises";

/**
 * Get the available slots on the country electoral district map
 * seperated by electoral districts.
 * @returns 
 */
const extractMapSlotsUnsorted = async () => {
  // We use the same svg data as a single source of truth
  // to get the coordinates.
  const svgData = await readFile('./src/include/map.svg');
  // Totally cool to read directly to memory, of course...
  const svgContent = svgData.toString();
  const svgContentLines = svgContent.split('\n');
  const seatCoordsByProvince = svgContentLines.reduce(
    (
      accum,
      svgLine
    ) => {
      // As we all know XML (which SVGs are) is totally regex parseable
      // without any problems whatsoever.
      if (/g id=".*_seats"/.test(svgLine)) {
        // Means we are starting the seats for a new electoral district.
        const districtName = /g id="(.*)_seats"/.exec(svgLine)?.[1];
        if (districtName) {
          // Create a new array for the seats to exist in.
          accum.set(districtName, []);
        }
        console.log(`Found ${districtName}`);
      } else if (/circle id="seat(?:\_\d+)?" cx="(.*)" cy="(.*)" r/.test(svgLine)) {
        // Meanwhile this is a seat.
        const [_match, xStr, yStr] = /circle id="seat(?:\_\d+)?" cx="(.*)" cy="(.*)" r/.exec(svgLine) ?? [];
        const x = Number.parseFloat(xStr);
        const y = Number.parseFloat(yStr);
        if (x && y) {
          // Maps are ordered, so get the last city set and insert
          // into it the seat coords.
          const lastInsertedCity = [...accum.values()].at(-1);
          lastInsertedCity?.push({x, y});
        }
        console.log(`Found seat ${x}, ${y}`);
      }
      return accum;
    },
    new Map<string, {x: number, y: number}[]>());
  return seatCoordsByProvince;
};


const sortMapSlots = (map: Map<string, {x: number, y: number}[]>): Map<string, {x: number, y: number}[]> => {
  map.values().forEach((repsInAProvince) => repsInAProvince.sort(
    (
      {y: CYa, x: CXa},
      {y: CYb, x: CXb}
    ) => CYb === CYa
      ? (CXb - CXa)
      : (CYb - CYa))
  );
  return map;
};


/**
 * Extract and sort map slots, return the slot locations
 * in the Turkish electoral districts map.
 */
export const extractMapSlots = async (): Promise<Map<string, {x: number, y: number}[]>> => sortMapSlots(await extractMapSlotsUnsorted()); 
