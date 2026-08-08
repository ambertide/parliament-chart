import { FC, useMemo } from "react";
import { BasicSelect, Option } from "../common";
import { MenuItem } from "./MenuItem";
import { parseOrdinal } from "@/utils";
import { useLocale, useTranslations } from "next-intl";

type MenuProps = {
  selectedTerm: number,
  selectedMilestone: string,
  milestonesOfTerm: Record<string, { date: string, slug: string, description?: string }>,
  onMilestoneSelect: (newMilestone: string) => void,
  onTermSelect: (newTerm: number, currentMilestone: string) => void,
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
  const selectedMilestoneDate = useMemo(() => new Date(Object.values(milestonesOfTerm).find(({ slug }) => selectedMilestone === slug)?.date || ''), [milestonesOfTerm, selectedMilestone]);
  return (
    <menu className="w-full max-w-160 items-stretch flex flex-col text-lg p-0 bg-background-secondary border-4 border-background-secondary rounded-sm">
      <span>
        <MenuItem
          icon="&#xE84F;"
        >
          {t.rich("termSelect", {
            termSelect: () => <BasicSelect
              options={[27, 28].map((value) => (
                {
                  value,
                  displayValue: `${parseOrdinal(value, locale)}`
                }
              ))}
              selectedValue={selectedTerm}
              id="parliament-term-picker"
              onChange={e => onTermSelect(e as number, selectedMilestone)}
            />,
            selectLabel: (labelText) => <label htmlFor="parliament-term-picker">
              {labelText}
            </label>
          })}
          {t.rich("milestoneSelect", {
            milestoneSelect: () => <BasicSelect
              options={(Object.entries(milestonesOfTerm) as ([string, { date: string, slug: string}][])).map(([_milestoneOfTerm, { slug }]) => ({
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
      </span>
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
      </MenuItem>
    </menu>
  );
};
