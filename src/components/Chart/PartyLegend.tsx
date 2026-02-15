import { FC } from "react"
import { PartyGroupLegendItem } from "./PartyGroupLegendItem"
import { PartyLegendItem } from "./PartyLegendItem"
import { Party } from "@/types"

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
      className="flex flex-wrap flex-col gap-1 md:max-h-28 sm:max-h-80"
    >
      {
        groupBy === 'deputies'
          ? partiesOrGroups.map(
            party => <PartyLegendItem
              key={party.partyName}
              {...party}
            />)
          : partiesOrGroups.map(
            ([groupName, parties]) => <PartyGroupLegendItem
              key={groupName}
              groupName={groupName}
              groupColor={parties[0].partyColor}
              partiesInGroup={parties}
            />)
      }
    </ol>)    
}
