import { FC } from "react";
import { PartyLegendItem } from "./PartyLegendItem";
import { Party } from "@/types";
import { PartyGroupLegendItem } from "./PartyGroupLegendItem";

type PartyLegenedProps = {
  groupBy: 'deputies',
  partiesOrGroups: Party[]
} | {
  groupBy: 'alliance' | 'groups',
  partiesOrGroups: [string, Party[]][]
};

export const PartyLegend: FC<PartyLegenedProps> = ({
  groupBy,
  partiesOrGroups
}) => {
  return (
    <ol
      className="flex flex-wrap flex-col gap-1 max-h-28"
    >
      {
        groupBy === 'deputies'
          ? partiesOrGroups.map(
            party => <PartyLegendItem
              key={party.partyName}
              {...party}
            />)
          : partiesOrGroups.map(
            ([groupName, parties]) => groupName === ''
              ?
              parties.map(p => <PartyLegendItem key={p.partyName} {...p}/>) :
              <PartyGroupLegendItem
                key={groupName}
                groupName={groupName}
                groupColor={parties[0].partyColor}
                partiesInGroup={parties}
              />)
      }
    </ol>);    
};
