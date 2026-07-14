import { useLocale, useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";

export const AttributionSection = ({ className }: { className: string }) => {
  const t = useTranslations('Sections');
  const locale = useLocale();
  return (
    <SectionWrapper
      title={t('Attribution')}
      className={className}
    >
      <div
        className="text-base font-serif"
      >
        <p>
          {t('ATTRIBUTION')}
        </p>
        <a className="text-emphasis-secondary italic" href={`/${locale}/docs/attribution`}>
          {t('See attribution for more details')}
        </a>
      </div>
    </SectionWrapper>
  );
};
