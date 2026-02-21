import { FC } from "react";
import { BasicSelect, Option } from "../common";
import { MenuItem } from "./MenuItem";
import { parseOrdinal } from "@/utils";

type MenuProps = {
  selectedTerm: number,
  onTermSelect: (newTerm: number) => void
  displayOptions: Option[],
  onDisplayOptionChange: (newDisplayOption: string) => void
};

export const Menu: FC<MenuProps> = ({
  selectedTerm,
  onTermSelect,
  displayOptions,
  onDisplayOptionChange
}) => (
  <menu className="flex gap-1 flex-col text-lg p-4 bg-background-secondary border-4 border-background-secondary rounded-sm">
    <MenuItem
      icon="\E84F"
    >
      <BasicSelect
        options={[20, 21, 22, 23, 24, 25, 26, 27, 28].map((value) => (
          {
            value,
            displayValue: `${parseOrdinal(value)}`
          }
        ))}
        selectedValue={selectedTerm}
        id="parliament-term-picker"
        onChange={e => onTermSelect(e as number)}
      />
      {' '}
      <label
        htmlFor="parliament-term-picker"
      >
        term of the Grand National Assembly
      </label>
    </MenuItem>
    <MenuItem
      icon="\E164"
    >
      <label htmlFor="sort-by-picker" className="unset">
        Ordered and grouped by each party&apos;s
      </label>
      {' '}
      <BasicSelect
        options={displayOptions}
        onChange={e => onDisplayOptionChange(e as string)}
        selectedValue="delegates"
        id="sort-by-picker"
      />
    </MenuItem>
  </menu>
)