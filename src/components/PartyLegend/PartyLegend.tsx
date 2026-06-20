import { FC } from "react";
import { PartyLegendItem } from "./PartyLegendItem";
import { Party } from "@/types";
import { PartyGroupLegendItem } from "./PartyGroupLegendItem";

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
};

export const PartyLegend: FC<PartyLegenedProps> = ({
  groupBy,
  partiesOrGroups,
  selectedAlliance,
  selectedParty,
  onPartyOrGroupSelect
}) => {
  return (
    <ol
      className={`flex flex-wrap flex-col gap-1 max-h-48 ${ groupBy === "deputies" ? "sm:max-h-28" : ""}`}
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
    </ol>);    
};
