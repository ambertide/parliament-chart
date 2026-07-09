import { partyShortName } from "@/utils";
import { RefObject, useCallback, useRef, useState, type FC } from "react";
import { PartyLegenedTooltip } from "./PartyLegendTooltip";
import { Party } from "@parlichart/types";
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
  const anchorRef = useRef<HTMLElement>(null);
  const [isHovering, setOnHover] = useState(false);
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
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      ref={anchorRef as RefObject<HTMLLIElement>}
    >
      <div
        className={`inline-block w-4 h-4 ${notSelected ? "opacity-25" : ""}`}
        style={{ backgroundColor }}
      />
      <span
        className={`inline-block leading-none ${notSelected ? "opacity-25" : ""}`}
      >
        {specialPartyName(partyName) ? t(specialPartyName(partyName) as string) : partyShortName(partyName)}
      </span>
      <PartyLegenedTooltip
        // This is necessary to re-trigger the calculation after animation
        key={`${isHovering}`}
        canonicalLongName={partyName}
        representativeCount={representativeCount}
        allianceName={allianceName}
        // Anchor positioning does not work here!
        // Probably because a new stacking context is created by absolutely positioned legend.
        anchor={anchorRef}
      />
    </li>
  );
};
