import { useLocale, useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";

export const AttributionSection = () => {
  const t = useTranslations('Sections');
  const locale = useLocale();
  return (
    <SectionWrapper
      title={t('Attribution')}
    >
      <div
        className="text-base font-serif"
      >
        <p>
          {t('Large parts of the data for Parlichart is sourced through the diligent work performed by editors of the Turkish Wikipedia and would be impossible without them.')}
        </p>
        <a className="text-emphasis-secondary italic" href={`/${locale}/docs/attribution`}>
          {t('See attribution for more details')}
        </a>
      </div>
    </SectionWrapper>
  );
};
