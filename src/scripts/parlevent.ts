import { termData } from "./resolveGovernments.ts";

export type RepresentativeRecord = {
  partyColor: string;
  party: string;
  name: string;
  province: string;
  endOfTermStatus: string;
  term: number;
};

export type PartyRecord = {
  representativeCount: number;
  partyColor: string;
  partyName: string;
  groupName: string;
  allianceName: string;
};

export type ProvinceRecord = {
  provinceName: string;
  representativeCount: number;
  partyDistribution: Record<string, number>;
};

type ParleventCommon = {
  date: Date;
};

type ParleventTermStart = {
  action: "TERM_STARTED";
  actor: string; // Term number,
  target: "Parliament";
  metadata: {
    governmentType: string;
    numberOfRepresentatives: number;
  };
} & ParleventCommon;

type ParleventTermEnded = {
  action: "TERM_ENDED";
  actor: string; // Term number,
  target: "Parliament";
  metadata: Record<string, never>;
} & ParleventCommon;

type ParleventOfficeAssumed = {
  action: "OFFICE_ASSUMED";
  actor: string;
  target: "Parliament";
  metadata: {
    electoralDistrict: string;
    party: string;
  };
} & ParleventCommon;

type ParleventOfficeVacated = {
  action: "OFFICE_VACATED";
  actor: string;
  target: "Parliament";
  metadata: {
    reason: "PASSED" | "TERM_END";
  };
} & ParleventCommon;

type Parlevent =
  | ParleventOfficeAssumed
  | ParleventTermStart
  | ParleventOfficeVacated
  | ParleventTermEnded;

export class ParleventEngine {
  parlevents: Parlevent[];
  state: "POSSIBLY_UNSORTED" | "SORTED" = "POSSIBLY_UNSORTED";

  constructor() {
    this.parlevents = [];
    Object.entries(termData).forEach(
      ([term, { start, end, governmentType, representativeCount }]) => {
        this.emit({
          action: "TERM_STARTED",
          actor: term,
          target: "Parliament",
          date: start,
          metadata: {
            governmentType,
            numberOfRepresentatives: representativeCount,
          },
        });
        this.emit({
          action: "TERM_ENDED",
          actor: term,
          target: "Parliament",
          date: end,
          metadata: {},
        });
      },
    );
  }

  emit = (event: Parlevent) => {
    this.state = "POSSIBLY_UNSORTED";
    this.parlevents.push(event);
  };

  /**
   * Get the parliamentary snapshot
   * at the date.
   *
   * @param at Date at which to get the events of.
   */
  source = (at: Date, p: PartyRecord[]) => {
    this.parlevents.sort(
      ({ date: dateA }, { date: dateB }) => dateA.getTime() - dateB.getTime(),
    );
    this.state = "SORTED";
    const events = this.parlevents.filter(({ date }) => date <= at);
    const lastParliamentaryTermStart = events.findLastIndex(
      ({ date, action }) => action === "TERM_STARTED" && date <= at,
    );
    const lastParliamentStart = events[lastParliamentaryTermStart];
    events.slice(lastParliamentaryTermStart);
    // Now we only have events of the last parliamentary term within that date.
    const source = events.reduce((accum, event) => {
      switch (event.action) {
        case "OFFICE_ASSUMED":
          accum.add({
            name: event.actor,
            party: event.metadata.party,
            endOfTermStatus: "",
            partyColor:
              p.find(({ partyName }) => partyName == event.metadata.party)
                ?.partyColor ?? "#000000",
            term: Number.parseInt(lastParliamentStart.actor),
            province: event.metadata.electoralDistrict,
          });
          break;
        default:
          break;
      }
      return accum;
    }, new Set<RepresentativeRecord>());
    return [...source];
  };

  dump = () => {
    return {
      events: this.parlevents,
    };
  };
}
