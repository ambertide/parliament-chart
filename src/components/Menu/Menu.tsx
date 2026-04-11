import { FC, useMemo } from "react";
import { BasicSelect, Option } from "../common";
import { MenuItem } from "./MenuItem";
import { parseOrdinal } from "@/utils";
import { useLocale, useTranslations } from "next-intl";

type MenuProps = {
  selectedTerm: number,
  selectedMilestone: string,
  milestonesOfTerm: Record<string, { date: string, slug: string }>,
  onMilestoneSelect: (newMilestone: string) => void,
  onTermSelect: (newTerm: number) => void,
  selectedDisplayOption: string,
  displayOptions: Option[],
  onDisplayOptionChange: (newDisplayOption: string) => void
};

export const Menu: FC<MenuProps> = ({
  selectedTerm,
  onTermSelect,
  selectedMilestone,
  milestonesOfTerm,
  onMilestoneSelect,
  displayOptions,
  selectedDisplayOption,
  onDisplayOptionChange
}) => {
  const locale = useLocale();
  const t = useTranslations('Menu');
  const selectedMilestoneDate = useMemo(() => new Date(Object.values(milestonesOfTerm).find(({ slug }) => selectedMilestone === slug)?.date || ''), [milestonesOfTerm, selectedMilestone])
  return (
    <menu className="w-full items-stretch flex flex-col text-lg p-4 bg-background-secondary border-4 border-background-secondary rounded-sm">
      <MenuItem
        icon="&#xE84F;"
      >
        {t.rich("termSelect", {
          termSelect: () => <BasicSelect
            options={[20, 21, 22, 23, 24, 25, 26, 27, 28].map((value) => (
              {
                value,
                displayValue: `${parseOrdinal(value, locale)}`
              }
            ))}
            selectedValue={selectedTerm}
            id="parliament-term-picker"
            onChange={e => onTermSelect(e as number)}
          />,
          selectLabel: (labelText) => <label htmlFor="parliament-term-picker">
            {labelText}
          </label>
        })}
      </MenuItem>
      <MenuItem
        icon="&#xEBCC;"
      >
        {t.rich("milestoneSelect", {
          milestoneSelect: () => <BasicSelect
            options={(Object.entries(milestonesOfTerm) as ([string, { date: string, slug: string}][])).map(([_milestoneOfTerm, { date, slug }]) => ({
              value: slug,
              displayValue: t(`milestone_${slug}`)
            }))}
            selectedValue={selectedMilestone} 
            id="parliament-milestone-picker"
            onChange={e => onMilestoneSelect(e as string)}
          />,
          selectLabel: text => <label htmlFor="parliament-milestone-picker">
            {text}
          </label>,
          selectedMilestoneDate
        })}
      </MenuItem>
      <MenuItem
        icon="&#xE164;"
      >
        {t.rich('orderBySelect', {
          orderBySelect: () => <BasicSelect
            options={displayOptions}
            onChange={e => onDisplayOptionChange(e as string)}
            selectedValue={selectedDisplayOption}
            id="sort-by-picker"
          />,
          selectLabel: (text) => <label htmlFor="sort-by-picker" className="unset">
            {text}
          </label>
          
        })}
        
        {' '}
        
      </MenuItem>
    </menu>
  )
}