import {   useCallback, type FC } from "react";
import type { Party } from "@parlichart/types";
import { PartyLegendItem } from "./PartyLegendItem";
import { useTranslations } from "next-intl";

type PartyLegendItemProps = {
  groupName: string,
  groupColor: string,
  partiesInGroup: Party[],
  onPartyOrGroupSelect: (type: 'alliance' | 'party', partyOrGroupName: string) => void,
  selectedParty: string,
  notSelected: boolean
};

/**
 * A group of party items
 */
export const PartyGroupLegendItem: FC<PartyLegendItemProps> = ({
  groupName,
  groupColor: backgroundColor,
  partiesInGroup,
  onPartyOrGroupSelect,
  notSelected = false,
  selectedParty
}) => {
  const onSelect = useCallback((e: unknown) => {
    (e as Event).stopPropagation();
    onPartyOrGroupSelect('alliance', groupName);
  }, [
    onPartyOrGroupSelect,
    groupName
  ]);
  const t = useTranslations('Parties');
  return (
    <li
      className="list-none grid gap-1 grid-cols-[0.75em_auto] cursor-pointer"
      onClick={onSelect}
    >
      <span
        className={`col-span-full ${notSelected ? "opacity-25" : ""}`}
      >
        {t(groupName)}
      </span>
      <div
        className={`block w-full h-full ${notSelected ? "opacity-25" : ""}`}
        style={{ backgroundColor }}
      />
      <ul
        className="pl-0 flex flex-col gap-1"
      >
        {partiesInGroup.map(({ partyName, ...partyProps}) => (
          <PartyLegendItem
            key={`${groupName}-${partyName}`}
            partyName={partyName}
            onSelect={() => onPartyOrGroupSelect('party', partyName)}
            // Blur if an alliance (that isn't this') is selected or if a party (that isn't this) is selected
            notSelected={notSelected || (!!selectedParty && selectedParty !== partyName)}
            {...partyProps}
          />
        ))}
      </ul>
    </li>
  );
};
