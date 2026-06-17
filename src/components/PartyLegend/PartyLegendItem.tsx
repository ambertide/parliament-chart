import { partyShortName } from "@/utils";
import { useCallback, type FC } from "react";
import { PartyLegenedTooltip } from "./PartyLegendTooltip";
import { Party } from "@/types";
import { useTranslations } from "next-intl";

type PartyLegendItemProps = Party & { onSelect: (partyName: string) => void, notSelected?: boolean}; 

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
  representativeCount,
  onSelect: _onSelect,
  notSelected = false
}) => {
  const onSelect = useCallback((e: unknown) => {
    (e as Event).stopPropagation();
    _onSelect(partyName);
  }, [
    _onSelect,
    partyName
  ]);
  const t = useTranslations('Parties');
  return (
    <li
      className={`group/party-legend-item list-none flex items-center gap-1 w-36 cursor-pointer `}
      onClick={onSelect}
    >
      <div
        className={`inline-block w-4 h-4 ${notSelected ? "opacity-50" : ""}`}
        style={{ backgroundColor }}
      />
      <span
        className={`inline-block leading-none ${notSelected ? "opacity-50" : ""}`}
        style={{
          anchorName: `--${partyShortName(partyName)}-legend-item`
        }}
      >
        {specialPartyName(partyName) ? t(specialPartyName(partyName) as string) : partyShortName(partyName)}
      </span>
      <PartyLegenedTooltip
        canonicalLongName={partyName}
        representativeCount={representativeCount}
        allianceName={allianceName}
        anchorName={`--${partyShortName(partyName)}-legend-item`}
      />
    </li>
  );
};