import { Vacancy } from "@/generator/parlevent/types";
import { IndividualRepresentative, Representative } from "@/types";



const canonizeName = (n: string) => (
  n
    .replaceAll('İ', 'I')
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
    .toLowerCase()
);

type PointDistance = (pointA: { x: number, y: number}, pointB: { x: number, y: number}) => number;

const pointDistance: PointDistance = ({x: xA, y: yA}, {x: xB, y: yB}) => (
  Math.sqrt(
    Math.pow(yB - yA, 2)
    + Math.pow(xB - xA, 2)
  )
);

/**
 * Populate the partial chart data with map locations by matching each seat to a
 * point on the map.
 *
 * @param mapData Map point slot data, seperated by province and sorted by y x offsets
 * @param chartData Parliamentary arch chart data not yet populated with map points
 * @param individualReperesentatives A list of individual represenetatives in this term.
 * @param vacancies Province seats that are vacant.
 */
export const matchMapToSeats = (
  mapData: Map<string, {x: number, y: number}[]>,
  // This one hold representations of the reps in the chart data
  chartData: Omit<Representative, 'mapLocation'>[],
  // this one holds actual representative data
  individualReperesentatives: IndividualRepresentative[],
  vacancies: Vacancy[] 
): Representative[] => {
  // First sort the reps by city.
  const groupedByProvince = Map.groupBy(individualReperesentatives, ({ province }) => canonizeName(province));
  // Also, those arrays by the party name.
  const groupedByProvinceAndPartyOnlyReps = new Map(Array.from(groupedByProvince).map(([province, reps]) => [province, Map.groupBy(reps, ({ party }) => party)]));
  // Furthermore we must insert the vacancies, which has a different object shape than this
  // into the vacancies table (ie: Consider that vacant seats are not rep data.)
  const groupedByProvinceAndParty = vacancies.reduce((accum, vacantSeat) => {
    // Boş is the special constant describing vacant seat "party".
    const canonProvinceName = canonizeName(vacantSeat.province);
    if (!accum.get(canonProvinceName)) {
      accum.set(canonProvinceName, new Map<string, []>);
    }

    if (!accum.get(canonProvinceName)?.get('Boş')) {
      accum.get(canonProvinceName)!.set('Boş', []);
    }
    accum.get(canonProvinceName)!.get('Boş')!.push({
      endOfTermStatus: '',
      name: '',
      party: 'Boş',
      partyColor: '#111111',
      province: vacantSeat.province,
      term: vacantSeat.term
    });
    return accum;
  }, groupedByProvinceAndPartyOnlyReps);
  // Finally group the chart data by parties to access the objects faster by party.
  const partyChartLookupTable = Map.groupBy(chartData, ({ party: { partyName } }) => partyName);
  groupedByProvinceAndParty.forEach((partiesInProvince, province) => {
    partiesInProvince.forEach((partyInProvince, party) => {
      partyInProvince.forEach((_repOfThatPartyInProvince) => {
      // Here we use the map slot data as a stack by selecting a slot.
        const nextSlotToAssign = mapData.get(province)?.pop();
        if (!nextSlotToAssign) {
          console.error('Unable to assign an MP a slot!');
          return;
        }
        // And select a chart seat to associate with this slot.
        const seatsOfThisPartyInArchChart = partyChartLookupTable.get(party);
        if (!seatsOfThisPartyInArchChart?.length) {
          console.error('Unable to find party members in the arch diagram to assign.');
          return;
        }
        // which is the closest party seat available, to get that we sort first
        // and then we will mutate the underlying array to take this seat out of considiration
        // in the next run.
        const distanceFromMapSlot = ({ location }: {location: {x: number, y: number }}) => pointDistance(location, nextSlotToAssign); 
        seatsOfThisPartyInArchChart.sort((seatA, seatB) => distanceFromMapSlot(seatB) - distanceFromMapSlot(seatA));
        const seatToAssign = seatsOfThisPartyInArchChart.pop();
        // Now that we found our seat we can actually override it.
        if (!seatToAssign) {
          console.error('This is literally impossible typescript.');
          return;
        }

        seatToAssign.province = province;
        (seatToAssign as Representative).mapLocation = nextSlotToAssign;
      });
    });
  });
  // We mutated this so it is fine.
  return chartData as Representative[];
};