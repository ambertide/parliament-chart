import { JSDOM } from "jsdom";
import { readFile, writeFile } from "node:fs/promises";
import { governmentMap, termData, milestones } from "./resolveGovernments.ts";
import { ParleventEngine } from "./parlevent.ts";

import type {
  RepresentativeRecord,
  PartyRecord,
  ProvinceRecord,
  PartySummaryRecord,
} from "./parlevent";

type GovernmentRecord = {
  headOfGovernment: string;
  canonicalName: string;
  /**
   * On westministerial cabinets, MPs could serve as ministers
   * simultaniously (and even had the right to cast votes for
   * another MPs in their absence, although it is not clear
   * if the same applies for non-mp ministers, see 109th and 96th
   * articles of the 1982 constiution), whereas on post-2018
   * presidential cabinets, every minister must be non-MPs,
   * and must resign from their seat prior to taking office (see 106th
   * article of the 1982 constitution with 2017 changes.)
   */
  ministerialBreakdown: "presidential" | Record<string, number>;
};

const getParliamentTable = async (term: number, engine: ParleventEngine) => {
  const data = await fetch(
    `https://tr.wikipedia.org/wiki/TBMM_${term}._d%C3%B6nem_milletvekilleri_listesi`,
  );
  const body = await data.text();
  const domParser = new JSDOM(body);
  const { document } = domParser.window;
  // Get the parliament members node list.
  // originally this was a single selector 'table > thead + tbody > tr'
  // but jsdom says NOOOO we cant have nice things lol
  const tables = document.querySelectorAll("table");
  const tableOfMPs = tables
    .values()
    .toArray()
    .find((table) => table.querySelectorAll("tr").length > 395);
  const mpRows = tableOfMPs?.querySelectorAll("tr").values().toArray() ?? [];
  return {
    term,
    mpTable: mpRows as HTMLTableRowElement[],
    engine,
  };
};

const parsePartyColor = (node: HTMLTableCellElement): string => {
  const { backgroundColor: partyColor } = node.style;
  const [_, r, g, b] = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(partyColor) ?? [
    "0",
    "0",
    "0",
    "0",
  ];
  return [r, g, b].reduce(
    (accum, c) => `${accum}${Number.parseInt(c).toString(16).padStart(2, "0")}`,
    "#",
  );
};

/**
 * Generate a structured MP array from the data.
 * @param mpTable MP Table dom node.
 * @returns The structured MPs array.
 */
const parseMPTable = ({
  engine,
  term,
  mpTable,
}: {
  engine: ParleventEngine;
  term: number;
  mpTable: HTMLTableRowElement[];
}): { engine: ParleventEngine; term: number; MPs: RepresentativeRecord[] } => {
  // What data to skip looking, this is decremented.
  // Columns are ordered.
  const dontLookFor = {
    province: 0,
    name: 0,
    partyColor: 0,
    party: 0,
    endOfTermStatus: 0,
    term: mpTable.length,
  } satisfies Record<keyof RepresentativeRecord, number>;

  const currentStatus = {
    province: "",
    name: "",
    partyColor: "",
    party: "",
    endOfTermStatus: "",
    term,
  } satisfies RepresentativeRecord;

  const records = mpTable
    // Remove table header and seperators.
    .filter(
      (mpRow) =>
        mpRow.querySelectorAll("td").length > 0 &&
        !(
          mpRow.querySelectorAll("td").values() as ArrayIterator<HTMLElement>
        ).some((n) => n.tagName === "TH"),
    )
    .map((mpRow) => {
      // Filter to only categories that we will seek in this row.
      const categoriesToLookThisTurn = Object.entries(dontLookFor).flatMap(
        ([category, skipFor]) =>
          skipFor === 0 ? [category as keyof RepresentativeRecord] : [],
      );
      const representativeRecord: RepresentativeRecord =
        categoriesToLookThisTurn.reduce(
          (mpAccumulator, categoryName, lookInChildIndex) => {
            // Then we fetch the category from the row and voila.
            if (lookInChildIndex >= mpRow.querySelectorAll("td").length) {
              return mpAccumulator;
            }
            // Now find the new value for this
            const valueHoldingNode = mpRow
              .querySelectorAll("td")
              .item(lookInChildIndex) as HTMLTableCellElement;
            const rescanUntil = valueHoldingNode.getAttribute("rowspan") ?? "1";
            dontLookFor[categoryName] =
              /* For... */ Number.parseInt(rescanUntil) /** rows */;
            if (
              categoryName === "province" &&
              valueHoldingNode.textContent === "Mardin" &&
              term == 27
            ) {
              // There is a slight formating error on wikipedia page for this
              dontLookFor[categoryName]--;
            }
            return {
              ...mpAccumulator,
              [categoryName]:
                categoryName === "partyColor"
                  ? parsePartyColor(valueHoldingNode)
                  : valueHoldingNode.textContent.replace("\n", ""),
            };
          },
          currentStatus,
        );

      (
        Object.entries(currentStatus) as [
          keyof RepresentativeRecord,
          string | number,
        ][]
      ).forEach(([k, _]: [keyof RepresentativeRecord, unknown]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        currentStatus[k] =
          representativeRecord[k as keyof RepresentativeRecord];
      });
      // In any case, update the dontLookFor counters for the next MProw.
      Object.entries(dontLookFor).forEach(
        ([k, v]) =>
          (dontLookFor[k as keyof typeof dontLookFor] = Math.max(v - 1, 0)),
      );
      if (!representativeRecord.endOfTermStatus) {
        representativeRecord.endOfTermStatus = representativeRecord.party;
      }
      console.log(term, termData[term]);
      engine.emit({
        action: "OFFICE_ASSUMED",
        target: "Parliament",
        actor: representativeRecord.name,
        metadata: {
          electoralDistrict: representativeRecord.province,
          party: representativeRecord.party,
        },
        date: new Date(termData[term].start),
      });
      engine.emit({
        action: "OFFICE_VACATED",
        target: "Parliament",
        actor: representativeRecord.name,
        metadata: {
          reason: "TERM_END",
        },
        date: new Date(termData[term].end),
      });
      return representativeRecord;
    });

  return {
    engine,
    term,
    MPs: records,
  };
};

const getParliamentRecords = async () => {
  const engine = new ParleventEngine();
  await engine.injectParlevents();
  await Promise.all(
    Array(9)
      .keys()
      .toArray()
      .map((offset) => offset + 20)
      .map((term) => getParliamentTable(term, engine).then(parseMPTable)),
  );

  const { parties: partySummaryData } = JSON.parse(
    await readFile("src/assets/partyUtils.json", "utf-8"),
  );

  await writeFile(
    "src/assets/events.json",
    JSON.stringify(engine.dump(), undefined, 4),
  );

  await writeFile(
    "src/assets/milestones.json",
    JSON.stringify(
      Object.entries(milestones).reduce(
        (prev, [term, mileStonesInTerm]) => ({
          ...prev,
          [term]: mileStonesInTerm.reduce(
            (p, milestone) => ({
              ...p,
              [milestone.name]: {
                snapshot: engine.source(
                  milestone.date,
                  partySummaryData as PartySummaryRecord[],
                ),
                date: milestone.date.toISOString(),
                slug: milestone.slug,
                description: milestone.description
              },
            }),
            {},
          ),
        }),
        {},
      ),
      undefined,
      4,
    ),
  );
};

getParliamentRecords();
