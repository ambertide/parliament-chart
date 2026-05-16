import { Representative } from "@/types";
import { useLayoutEffect } from "react";


const nameToASCII = (n: string) => (
  n.replaceAll('İ', 'I')
    .replaceAll('ı', 'i')
    .replaceAll('Ç', 'C')
    .replaceAll('ç', 'c')
    .replaceAll('Ş', 'S')
    .replaceAll('ş', 's')
    .replaceAll('Ü', 'U')
    .replaceAll('ü', 'u')
    .replaceAll('Ö', 'O')
    .replaceAll('ö', 'o')
    .replaceAll('Ğ', 'G')
    .replaceAll('ğ', 'g')
    .replaceAll(' ', '_')
    .replaceAll('(I)', '(i)')
    .replaceAll('(II)', '(ii)')
    .replaceAll('(III)', '(iii)')
    .replaceAll('â', 'a')
);

/**
 * Given an array of circle elements, filter those that are
 * actually parliamentary seats and then put them into a
 * hashmap.
 * @param maybeProvinces Array of circle svg elements
 * @returns 
 */
const createSeatsMap = (maybeProvinces: NodeListOf<SVGGElement>): Map<
  string,
  SVGCircleElement[]
> => 
  maybeProvinces
    .values()
    .filter(e => e.id.endsWith('_seats'))
    .reduce((accum, e) => accum.set(e.id.replace('_seats', ''), e
      .querySelectorAll('circle')
      .values()
      .toArray()
      .toSorted(
        (
          {cy: CYa, cx: CXa},
          {cy: CYb, cx: CXb}
        ) => CYb.baseVal.value === CYa.baseVal.value
          ? (CXa.baseVal.value - CXb.baseVal.value)
          : (CYa.baseVal.value - CYb.baseVal.value))
      .toReversed()
    )
    , new Map()
    );

/**
 * Given a array of represenetatives and seats map,
 * color the maps.
 *
 * @param representatives List of representatives
 * @param seats Seat map
 */
const colourSeatsWithRepresentative = (
  representatives: Representative[],
  seats: Map<string, SVGCircleElement[]>
) => { 
  representatives.forEach(({ province, party }) => {
    if (province) {
      const maybeSeatsOfProvinces = seats.get(nameToASCII(province)?.toLowerCase());
      const nextSeatToColor = maybeSeatsOfProvinces?.pop();
      if (nextSeatToColor) {
        nextSeatToColor.style.fill = party.partyColor;
      }
    }
  });
};


/**
 * Remove the leftover seats.
 * @param seats
 */
const removeLeftoverSeats = (seats: Map<string, SVGCircleElement[]>) => {
  seats.values().flatMap(v => v).forEach(c => c.remove());
};

/**
 * Color the map, return the map of provinces -> circle elements
 * @param representatives Representative list
 * @returns The string -> circle element map, leftovers
 * are unassigned circles.
 */
const colorMap = (representatives: Representative[]): Map<string, SVGCircleElement[]> => {
  const maybeProvinces = document.querySelectorAll('svg > g#map g') as NodeListOf<SVGCircleElement>;
  const seatsMap = createSeatsMap(maybeProvinces);
  colourSeatsWithRepresentative(representatives, seatsMap);
  return seatsMap;
};

/**
 * Fill the map that was already rendered into the DOM.
 * Remove the unused ones.
 */
export const useFillPaintSeats = (representatives: Representative[]) => {
  useLayoutEffect(() => {
    const leftoverSeats = colorMap(representatives);
    removeLeftoverSeats(leftoverSeats);
  }, [representatives]);
};
