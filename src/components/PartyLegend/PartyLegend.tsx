import { ComponentProps, FC, useState } from "react";
import { PartyLegendItem } from "./PartyLegendItem";
import { Party } from "@/types";
import { PartyGroupLegendItem } from "./PartyGroupLegendItem";

import { Menu } from "../Menu";

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
} & ComponentProps<typeof Menu>;

export const PartyLegend: FC<PartyLegenedProps> = ({
  groupBy,
  partiesOrGroups,
  selectedAlliance,
  selectedParty,
  onPartyOrGroupSelect,
  ...menuProps
}) => {
  const [isOpen, setOpen] = useState(false);
  return <>
    <button
      className="peer absolute right-4 bottom-4 aria-pressed:-translate-y-46 transition px-6 py-1 bg-background-secondary"
      aria-pressed={isOpen}
      onClick={() => setOpen(prevIsOpen => !prevIsOpen)}
    >
      Legend
    </button>
    <figcaption
      className={`absolute right-4 bottom-4 overflow-hidden ${!isOpen ? 'pointer-events-none' : ''}`}
    >
      <div
        className={`${!isOpen ? 'translate-y-full' : ''} transition bg-background-secondary overflow-scroll min-w-77 w-fit h-46 p-2`}
      >
        {isOpen && <>
          <Menu
            {...menuProps}
          />
          <ol
            className={`flex flex-wrap overflow-x-scroll overflow-y-hidden flex-col gap-1 justify-between h-full`}
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
        </>}
      </div>
    </figcaption>
  </>;
};
