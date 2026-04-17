import { default as milestones } from "../assets/milestones.json" with { type: "json" };
import { default as parties } from "../assets/partyUtils.json" with { type: "json" };

type SankeyData = {
  from: string;
  to: string;
  value: number;
};

type Milestone = typeof milestones['28']['28_PARLIAMENT_FORMATION'];

const calculateSankeyDataForPair = (from: Milestone, to: Milestone): SankeyData[]  => {
  // Initialize all possible output values to 0
  const {
    slug: fromSlug,
    snapshot: {
      parties: fromParties,
      representatives: fromReps
    }
  } = from;
  const {
    slug: toSlug,
    snapshot: {
      parties: toParties,
      representatives: toReps
    }
  } = to;
  const possibleValues = fromParties.flatMap(
    ({ partyName: fromPartyName }) => [
      ...toParties.map(
        ({ partyName: toPartyName }) => ({
          from: `${fromPartyName}_${fromSlug}`,
          to: `${toPartyName}_${toSlug}`,
          value: 0
        })),
      {
        from: `${fromPartyName}_${fromSlug}`,
        to: 'vacant',
        value: 0
      }
    ]);

  // Now for each party, find the representatives that moves around
  const sankeyData = fromReps.reduce((track, { name: representativeName, party: partyName}) => {
    // Check if the rep changed parties.
    // CAUTION: This looks overengineered but actually we are carefully avoiding
    // a edge case where MPs of same name exists in two parties but only one chanes
    // a party by checking their own party first.
    const maybeSameRep = toReps.find(({ name, party }) => name === representativeName && party === partyName);
    if (maybeSameRep !== undefined) {
      // Rep stayed in their own party, marked as found as well.
      // @ts-ignore: every once in a while, some dynamic typing is fine, actually.
      maybeSameRep.found = true;
      const changedRecord = track.find(({ from, to }) => from.startsWith(`${partyName}_`) && to.startsWith(`${partyName}_`));
      changedRecord!.value++;
      return track;
    }
    // Now, if it IS changed, we need to find the representatives new "home"
    // @ts-ignore: likewise.
    const newRepRecord = toReps.find(({ name, party, found = false }) => !found && name === representativeName && party !== partyName);
    if (!newRepRecord) {
      const changedRecord = track.find(({ from, to }) => from.startsWith(`${partyName}_`) && to === 'vacant');
      changedRecord!.value++;
      return track;
    }
    const changedRecord = track.find(({ from, to }) => from.startsWith(`${partyName}_`) && to.startsWith(`${newRepRecord.party}_`)); 
    changedRecord!.value++;
    // @ts-ignore: likewise.
    newRepRecord.found = true;
    return track;
  }, possibleValues);
  return sankeyData;
}

const calculateData = (): SankeyData[] => {
  const milestoneOfTerm = milestones["28"];
  // So for instance, for [1, 2, 3, 4] you would
  // have [[1, 2], [2, 3], [3, 4]]
  // ie: sliding window.
  const entries = Object.entries(milestoneOfTerm);
  const pairs = [...new Array(entries.length - 1).keys()].map((_, i) => [
    entries[i],
    entries[i + 1],
  ]);
  return pairs.flatMap(([[_, from], [__, to]]) => calculateSankeyDataForPair(from, to)).filter(({ value }) => !!value);
};

const shortenPartyName = (partyName: string): string => {
  const [canonicalLongName, milestone] = partyName.split('_');
  const partyRecord = parties.parties.find(({ canonicalLongName: longName }) => longName === canonicalLongName);
  if (partyRecord) {
    return `${partyRecord.canonicalShortName}_${milestone}`
  }
  return partyName;
}

const noUnicode = (text: string) => text.split('').map(ch => ({
  'ü': 'u',
  'Ü': 'U',
  'İ': 'I',
  'ı': 'i',
  'ö': 'o',
  'Ö': 'O',
  'ş': 'ş',
  'Ş': 'S',
  "ğ": "g",
  "Ğ": "G",
  "ç": "c",
  "Ç": "C"
}[ch] ?? ch)).join('')

/**
 * Convert JS sankey data to mermaid markup for sankey
 * @see https://mermaid.js.org/syntax/sankey.html
 * @param data from-to data pairs
 * @returns Mermaid acceptable markup
 */
const convertDataToMarkup = (data: SankeyData[]): string =>
  data.map(({ from, to, value}) => noUnicode(`"${shortenPartyName(from)}","${shortenPartyName(to)}",${value}`)).join("\n");

const generateDiagrams = () => {
  const data: SankeyData[] = calculateData();
  const mermaidMarkup: string = convertDataToMarkup(data);
  console.log(mermaidMarkup)
};

generateDiagrams();
