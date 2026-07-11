import { useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";
import { FC, PropsWithChildren } from "react";

export const ParliamentSection: FC<PropsWithChildren<{className: string}>> = ({ children, className }) => {
  const t = useTranslations('Sections');
  return <SectionWrapper
    className={className}
    title={t('Browse the Parliament\'s Status')}
  >
    {children}
  </SectionWrapper>;
};
