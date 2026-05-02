import { partyShortName } from "@/utils";
import type { FC } from "react";
import { PartyLegenedTooltip } from "./PartyLegendTooltip";
import { Party } from "@/types";
import { useTranslations } from "next-intl";

type PartyLegendItemProps = Party;

const specialPartyName = (partyName: string) => (
  ['Boş', 'Bağımsız'].includes(partyName) ? partyName : null
);

/**
 * A single legend item for a party.
 */
export const PartyLegendItem: FC<PartyLegendItemProps> = ({
  partyName,
  partyColor: backgroundColor,
  allianceName,
  representativeCount 
}) => {
  const t = useTranslations('Parties');
  return (
    <li
      className="group/party-legend-item list-none flex items-center gap-1 w-36 cursor-zoom-in"
    >
      <div
        className="inline-block w-4 h-4"
        style={{ backgroundColor }}
      />
      <PartyLegenedTooltip
        canonicalLongName={partyName}
        representativeCount={representativeCount}
        allianceName={allianceName}
        anchorName={`--${partyShortName(partyName)}-legend-item`}
      />
      <span
        className="inline-block leading-none"
        style={{
          anchorName: `--${partyShortName(partyName)}-legend-item`
        }}
      >
        {specialPartyName(partyName) ? t(specialPartyName(partyName) as string) : partyShortName(partyName)}
      </span>
    </li>
  );
};