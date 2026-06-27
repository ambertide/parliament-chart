import { useTranslations } from "next-intl";
import { BasicSelect } from "../common";
import { FC } from "react";

export const ExpressGroupChange: FC<{
  selectedDisplayOption: 'deputies' | 'alliance'
  onGroupByChange: (newGroupBy: 'deputies' | 'alliance') => void
}> = ({
  selectedDisplayOption,
  onGroupByChange
}) => {
  const t = useTranslations('ExpressSelect');
  return t.rich('orderBySelect', {
    orderBySelect: () => <BasicSelect
      options={[
        { value: 'alliance', displayValue: t('electoralAlliance')},
        { value: 'deputies', displayValue: t('numberOfRepresentatives')}
      ]}
      onChange={e => onGroupByChange(e as 'alliance' | 'deputies')}
      selectedValue={selectedDisplayOption}
      className="text-lg"
      id="sort-by-picker"
    />,
    selectLabel: (text) => <label htmlFor="sort-by-picker" className="unset text-lg">
      {text}
    </label>
          
  });
};