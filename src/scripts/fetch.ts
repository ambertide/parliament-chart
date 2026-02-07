import { JSDOM } from 'jsdom';
import { writeFile } from 'node:fs/promises'
type RepresentativeRecord = {
  partyColor: string,
  party: string,
  name: string,
  province: string,
  endOfTermStatus: string,
  term: number
}

type PartyRecord = {
  representativeCount: number,
  partyColor: string,
  partyName: string,
  groupName: string,
  allianceName: string
}

type ProvinceRecord = {
  provinceName: string,
  representativeCount: number,
  partyDistribution: Record<string, number>
}

const getParliamentTable = async (term: number) => {
  const data = await fetch(`https://tr.wikipedia.org/wiki/TBMM_${term}._d%C3%B6nem_milletvekilleri_listesi`);
  const body = await data.text();
  const domParser = new JSDOM(body);
  const { document } = domParser.window;
  // Get the parliament members node list.
  // originally this was a single selector 'table > thead + tbody > tr'
  // but jsdom says NOOOO we cant have nice things lol
  const tables = document.querySelectorAll('table');
  const tableOfMPs = tables.values().toArray().find(table => table.querySelectorAll('tr').length > 395);
  const mpRows = tableOfMPs?.querySelectorAll('tr').values().toArray() ?? [];
  return {
    term,
    mpTable: mpRows as HTMLTableRowElement[]
  };
}

const parsePartyColor = (node: HTMLTableCellElement): string => {
  const { backgroundColor: partyColor } = node.style;
  const [_, r, g, b] = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(partyColor) ?? ['0', '0', '0', '0'];
  return [r, g, b].reduce((accum, c) => `${accum}${Number.parseInt(c).toString(16).padStart(2, '0')}`, '#')
}

/**
 * Generate a structured MP array from the data.
 * @param mpTable MP Table dom node.
 * @returns The structured MPs array.
 */
const parseMPTable = ({term, mpTable}: {term: number, mpTable: HTMLTableRowElement[]}): {term: number, MPs: RepresentativeRecord[]} => {
  // What data to skip looking, this is decremented.
  // Columns are ordered.
  const dontLookFor = {
    province: 0,
    name: 0,
    partyColor: 0,
    party: 0,
    endOfTermStatus: 0,
    term: mpTable.length
  } satisfies Record<keyof RepresentativeRecord, number>

  const currentStatus = {
    province: "",
    name: "",
    partyColor: "",
    party: "",
    endOfTermStatus: "",
    term
  } satisfies RepresentativeRecord

  const records = mpTable
    // Remove table header and seperators.
    .filter(mpRow => mpRow.querySelectorAll('td').length > 0 && !(mpRow.querySelectorAll('td').values() as ArrayIterator<HTMLElement>).some(n => n.tagName === 'TH'))  
    .map(mpRow => {
    // Filter to only categories that we will seek in this row.
      const categoriesToLookThisTurn = Object
        .entries(dontLookFor)
        .flatMap(([category, skipFor]) => skipFor === 0 ? [category as keyof RepresentativeRecord] : []);
      const representativeRecord: RepresentativeRecord =
        categoriesToLookThisTurn.reduce(
          (
            mpAccumulator,
            categoryName,
            lookInChildIndex
          ) => {
            // Then we fetch the category from the row and voila.
            if (lookInChildIndex >= mpRow.querySelectorAll('td').length) {
              return mpAccumulator
            }
            // Now find the new value for this
            const valueHoldingNode = mpRow.querySelectorAll('td').item(lookInChildIndex) as HTMLTableCellElement;
            const rescanUntil = valueHoldingNode.getAttribute('rowspan') ?? '1';
            dontLookFor[categoryName] = /* For... */ Number.parseInt(rescanUntil) /** rows */;
            if (categoryName === 'province' && valueHoldingNode.textContent === 'Mardin' && term == 27) {
              // There is a slight formating error on wikipedia page for this
              dontLookFor[categoryName]--;
            }
            return {
              ...mpAccumulator,
              [categoryName]: categoryName === 'partyColor' ? parsePartyColor(valueHoldingNode) : valueHoldingNode.textContent.replace('\n', '')
            }
          },
          currentStatus
        );

    
      (Object.entries(currentStatus) as [keyof RepresentativeRecord, string | number][]).forEach(([k, _]: [keyof RepresentativeRecord, unknown]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        currentStatus[k] = representativeRecord[k as keyof RepresentativeRecord];
      });
      // In any case, update the dontLookFor counters for the next MProw.
      Object.entries(dontLookFor).forEach(([k, v]) => dontLookFor[k as keyof typeof dontLookFor] = Math.max(v - 1, 0));
      if (!representativeRecord.endOfTermStatus) {
        representativeRecord.endOfTermStatus = representativeRecord.party;
      }
      return representativeRecord;
    });

  return {
    term,
    MPs: records
  };
}

const generatePartyLookupTable = ({ MPs, ...args }: ReturnType<typeof parseMPTable>): ReturnType<typeof parseMPTable> & {parties: PartyRecord[] } => (
  {
    ...args,
    MPs,
    parties: Object.entries(Object.groupBy(MPs, ({ party }) => party))
      .map(([partyName, reps]) => ({
        partyName,
        partyColor: reps?.[0].partyColor ?? '#000000',
        representativeCount: reps?.length ?? 0,
        allianceName: '',
        groupName: ''
      }) satisfies PartyRecord),
  }
);

const generateProvinceLookupTable = ({
  MPs,
  ...args
}: ReturnType<typeof generatePartyLookupTable>):  ReturnType<typeof generatePartyLookupTable> & { provinces: ProvinceRecord[] } => ({
  ...args,
  MPs,
  provinces: Object.entries(Object.groupBy(MPs, ({ province }) => province))
    .map(([ provinceName, reps ]) => ({
      provinceName,
      representativeCount: reps?.length ?? 0,
      partyDistribution: Object.entries(Object.groupBy((reps ?? []) as RepresentativeRecord[], ({ party }) => party))
        .reduce((accum, [party, innerReps]) => ({...accum, [party]: innerReps?.length ?? 0}), {})
    }))
});

const hasAlliances = (term: number) => [27, 28].includes(term)

const resolveAlliances = (term: number, party: string) => Object.entries(({
  "27": {
    "Cumhur İttifakı": ["Adalet ve Kalkınma Partisi", "Milliyetçi Hareket Partisi", "Büyük Birlik Partisi"],
    "Millet İttifakı": ["Cumhuriyet Halk Partisi", "İYİ Parti", "Saadet Partisi", "Demokrat Parti"]
  },
  "28": {
    "Cumhur İttifakı": ["Adalet ve Kalkınma Partisi", "Milliyetçi Hareket Partisi", "Büyük Birlik Partisi", "Hür Dava Partisi", "Demokratik Sol Parti"],
    "Millet İttifakı": ["Cumhuriyet Halk Partisi", "İYİ Parti", "Saadet Partisi", "Demokrat Parti", "Demokrasi ve Atılım Partisi", "Gelecek Partisi"],
    "Emek ve Özgürlük İttifakı": ["Yeşil Sol Parti", "Türkiye İşçi Partisi", "Emek Partisi", "Halkların Eşitlik ve Demokrasi Partisi", "Demokratik Bölgeler Partisi"]
  },
} as Record<string, Record<string, string[]>>)[`${term}`])?.find(([ key, values ]) => values.includes(party))?.[0] ?? ''

const addAlliances = ({term, parties, ...args}: ReturnType<typeof generateProvinceLookupTable>): ReturnType<typeof generatePartyLookupTable> => ({
  term,
  parties: parties.map(({partyName, ...args}) => ({
    partyName,
    ...args,
    groupName: partyName,
    allianceName: hasAlliances(term) ? resolveAlliances(term, partyName) : '',
  })),
  ...args
})

const getParliamentRecords = async () => {
  const results = await Promise.all(
    Array(21)
      .keys()
      .toArray()
      .map(offset => offset + 8)
      .map(term => getParliamentTable(term)
        .then(parseMPTable)
        .then(generatePartyLookupTable)
        .then(generateProvinceLookupTable)
        .then(addAlliances)
      )
  );
  const shapedData = Object.fromEntries(results.map((data, index) => ([`${index + 8}`, data])))
  await writeFile('src/assets/terms.json', JSON.stringify(shapedData, undefined, 4));
}

getParliamentRecords();