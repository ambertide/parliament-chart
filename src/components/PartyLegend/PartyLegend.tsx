import { FC } from "react";
import { PartyLegendItem } from "./PartyLegendItem";
import { Party } from "@/types";
import { PartyGroupLegendItem } from "./PartyGroupLegendItem";
import { ExpressGroupChange } from "./ExpressGroupChange";

type PartyLegenedProps = ({
  groupBy: 'deputies',
  partiesOrGroups: Party[]
} | {
  groupBy: 'alliance',
  partiesOrGroups: [string, Party[]][]
}) & {
  onPartyOrGroupSelect: (type: 'alliance' | 'party', partyOrGroupName: string) => void,
  selectedParty: string,
  selectedAlliance: string
  expressChangeMode?: boolean,
  onGroupByChange?: (newGroupBy: 'deputies' | 'alliance') => void
};

export const PartyLegend: FC<PartyLegenedProps> = ({
  groupBy,
  partiesOrGroups,
  selectedAlliance,
  selectedParty,
  onPartyOrGroupSelect,
  expressChangeMode = false,
  onGroupByChange = f => f
}) => {
  return (
    <div
      className={expressChangeMode ? "p-4 flex flex-col gap-2 bg-background-secondary" : ""}
    >
      <div>
        {expressChangeMode && <ExpressGroupChange
          selectedDisplayOption={groupBy}
          onGroupByChange={onGroupByChange}
        />}
      </div>
      <ol
        className={`flex flex-wrap overflow-x-scroll overflow-y-hidden flex-col gap-1 max-h-48 ${ groupBy === "deputies" ? "sm:max-h-28" : ""}`}
      >
        {
          groupBy === 'deputies'
            ? partiesOrGroups.map(
              party => <PartyLegendItem
                key={party.partyName}
                onSelect={(partyName: string) => onPartyOrGroupSelect('party', partyName)}
                notSelected={!!selectedParty && selectedParty !== party.partyName}
                {...party}
              />)
            : partiesOrGroups.map(
              ([groupName, parties]) => groupName === ''
                ? parties.map(p =>
                  <PartyLegendItem
                    key={p.partyName}
                    onSelect={(partyName: string) => onPartyOrGroupSelect('party', partyName)}
                    notSelected={!!selectedAlliance || (!!selectedParty && selectedParty !== p.partyName)}
                    {...p}
                  />) :
                <PartyGroupLegendItem
                  key={groupName}
                  groupName={groupName}
                  groupColor={parties[0].partyColor}
                  partiesInGroup={parties}
                  onPartyOrGroupSelect={onPartyOrGroupSelect}
                  notSelected={(!!selectedAlliance && selectedAlliance !== groupName) || (!!selectedParty && !parties.find(({ partyName }) => partyName === selectedParty))}
                  selectedParty={selectedParty}
                />)
        }
      </ol>
    </div>
  );    
};
