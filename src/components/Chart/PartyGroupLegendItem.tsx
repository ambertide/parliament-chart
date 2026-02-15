import type { FC } from "react";
import type { Party } from "@/types";
import { PartyLegendItem } from "./PartyLegendItem";

type PartyLegendItemProps = {
  groupName: string,
  groupColor: string,
  partiesInGroup: Party[]
}

/**
 * A group of party items
 */
export const PartyGroupLegendItem: FC<PartyLegendItemProps> = ({
  groupName,
  groupColor: backgroundColor,
  partiesInGroup
}) => (
  <li
    className="list-none grid gap-1 grid-cols-[0.75em_auto]"
  >
    <span
      className="col-span-full"
    >
      {groupName}
    </span>
    <div
      className="block w-full h-gull"
      style={{ backgroundColor }}
    />
    <ul
      className="pl-0 flex flex-col gap-1"
    >
      {partiesInGroup.map(({ partyColor, partyName }) => (
        <PartyLegendItem
          key={`${groupName}-${partyName}`}
          partyName={partyName}
          partyColor={partyColor}
        />
      ))}
    </ul>
  </li>
)