import { readFile } from "fs/promises";
import { termData } from "./milestones";
import {
  Parlevent,
  PartyDelta,
  PartyRecord,
  PartySummaryRecord,
  RepresentativeRecord,
  Vacancy
} from "./types";

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

  injectParlevents = async () => {
    const { events } = JSON.parse(
      await readFile("src/include/events.declarations.json", "utf-8"),
    ) as { events: Parlevent[] };
    this.parlevents = [
      ...this.parlevents,
      ...events.map(({ date, ...args }) => ({ date: new Date(date), ...args })),
    ];
  };

  emit = (event: Parlevent) => {
    this.state = "POSSIBLY_UNSORTED";
    this.parlevents.push(event);
  };

  resolvePartySnapshotFromRepsSnapshot = (
    reps: Set<RepresentativeRecord>,
    partySummaries: PartySummaryRecord[],
    allianceSnapshot: Map<string, Set<string>>,
  ) =>
    // This has *HORRIBLE* complexity
    // I suspect V8 wouldn't even touch this with a ten foot
    // pole so it likely remains horrible in runtime too
    // BUT IT IS WHAT IT IS.
    partySummaries
      .map(
        ({ canonicalLongName, color }) =>
          ({
            partyName: canonicalLongName,
            partyColor: color,
            groupName: "",
            allianceName:
              allianceSnapshot
                .entries()
                .find(([_, Ps]) => Ps.has(canonicalLongName))?.[0] ?? "",
            representativeCount: reps
              .values()
              .filter(({ party }) => party === canonicalLongName)
              .toArray().length,
          }) satisfies PartyRecord,
      )
      .filter(({ representativeCount }) => !!representativeCount);

  /**
   * Get the parliamentary snapshot
   * at the date.
   *
   * @param at Date at which to get the events of.
   */
  source = (at: Date, p: PartySummaryRecord[]) => {
    this.parlevents.sort(
      ({ date: dateA }, { date: dateB }) => (dateA as Date).getTime() - (dateB as Date).getTime(),
    );
    this.state = "SORTED";
    const events = this.parlevents.filter(({ date }) => date <= at);

    const source = events.reduce(
      (accum, event) => {
        switch (event.action) {
          case "OFFICE_ASSUMED":
            accum.representatives.add({
              name: event.actor,
              party: event.metadata.party,
              endOfTermStatus: "",
              partyColor:
                p.find(
                  ({ canonicalLongName }) =>
                    canonicalLongName == event.metadata.party,
                )?.color ?? "#000000",
              term: Number.parseInt(accum.currentTerm),
              province: event.metadata.electoralDistrict,
            });
            const maybeFilledVacancyIndex = accum.vacancies.findIndex(({ lastOfficeHolder: { province }}) => province === event.metadata.electoralDistrict);
            if (maybeFilledVacancyIndex >= 0) {
              // When a party member is reinstated, or when a seat is
              // filled with a by-election we need to fill the empty seat.
              accum.vacancies.splice(maybeFilledVacancyIndex, 1);
            }
            break;
          case "TERM_STARTED":
            accum.currentTerm = event.actor;
            break;
          case "ALLIANCE_DISBANDED":
            accum.alliances.delete(event.actor);
            break;
          case "ALLIANCE_ESTABLISHED":
            accum.alliances.set(event.actor, new Set<string>());
            break;
          case "OFFICE_VACATED":
            if (event.metadata.reason === 'TERM_END') {
              // Unimportant, already handled etc.
              break;
            }
            // dangerous assumption that no names repeat within
            // a single term.
            const toDelete = accum.representatives
              .values()
              .find(({ name }) => name === event.actor);
            if (toDelete) {
              accum.representatives.delete(toDelete);
              accum.vacancies.push({
                term: toDelete.term,
                province: toDelete.province,
                lastOfficeHolder: toDelete,
                officeVacatedEvent: event
              });
            } else {
              console.error(`Could not find ${event.actor}`);
            }
            break;
          case "PARTY_CHANGED":
            const { target: newParty, actor: representativeName } = event;
            const targetRepresentative =  accum.representatives
              .values()
              .find(({ name, party }) => (!event.metadata.from || event.metadata.from === party) && name === representativeName);
            if (targetRepresentative) {
              const oldParty = targetRepresentative.party;
              targetRepresentative.party = newParty;
              const partyFound = p.find(
                ({ canonicalLongName }) => canonicalLongName == newParty,
              );
              if (!partyFound) {
                console.warn(`
                  WARN: ${newParty} was not found in party list.  
                `);
              }
              targetRepresentative.partyColor =
                p.find(({ canonicalLongName }) => canonicalLongName == newParty)
                  ?.color ?? "#000000";
              accum.partyDelta.push({
                decrease: oldParty,
                increase: newParty,
                date: typeof event.date === 'string' ? event.date : event.date.toISOString()
              });
            } else {
              console.error(
                `ERR: Representative ${representativeName} not in this term.`,
              );
            }
            break;
          case "TERM_ENDED":
            accum.representatives.clear();
            accum.vacancies = [];
            break;
          case "PARTY_JOINED_ALLIANCE":
            accum.alliances.get(event.target)?.add(event.actor);
            break;
          case "PARTY_LEFT_ALLIANCE":
            accum.alliances.get(event.target)?.delete(event.actor);
            break;
          default:
            break;
        }
        return accum;
      },
      {
        currentTerm: "20",
        representatives: new Set<RepresentativeRecord>(),
        alliances: new Map<string, Set<string>>(),
        vacancies: [] as Vacancy[],
        partyDelta: [] as PartyDelta[]
      },
    );
    return {
      representatives: [...source.representatives],
      parties: this.resolvePartySnapshotFromRepsSnapshot(
        source.representatives,
        p,
        source.alliances,
      ),
      vacancies: [ ...source.vacancies ],
      partyDelta: source.partyDelta
    };
  };

  dump = () => {
    return {
      events: this.parlevents,
    };
  };
}
