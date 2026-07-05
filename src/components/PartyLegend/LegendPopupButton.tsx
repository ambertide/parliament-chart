import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

export const LegendPopupButton: FC<{
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}> = ({
  isOpen,
  setOpen,
}) => {
  const t = useTranslations('Legend');
  return <button
    className="peer flex gap-2 justify-end items-center text-lg font-serif absolute right-4 bottom-4 aria-pressed:-translate-y-46 transition px-6 py-1 bg-background-secondary"
    aria-pressed={isOpen}
    onClick={() => setOpen(prevIsOpen => !prevIsOpen)}
  >
    <span className={`font-[Material_Symbols_Outlined] transition duration-300 ${isOpen ? '-rotate-180' : ''}`}>
      &#xF729;
    </span>
    {' '}
    {t('Legend')}
  </button>; 
};
