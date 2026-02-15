import type { FC } from "react";

type PartyLegendItemProps = {
  partyName: string,
  partyColor: string
}

/**
 * A single legend item for a party.
 */
export const PartyLegendItem: FC<PartyLegendItemProps> = ({
  partyName,
  partyColor: backgroundColor
}) => (
  <li
    className="list-none flex items-center gap-1 w-36 cursor-zoom-in"
  >
    <div
      className="inline-block w-4 h-4"
      style={{ backgroundColor }}
    />
    <span
      className="inline-block leading-none"
    >
      {partyName}
    </span>
  </li>
)