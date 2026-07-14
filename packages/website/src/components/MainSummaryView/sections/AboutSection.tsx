import { useLocale, useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";

export const AboutSection = ({ className }: { className: string }) => {
  const t = useTranslations('Sections');
  const locale = useLocale();
  return (
    <SectionWrapper
      title={t('About')}
      className={className}
    >
      <div
        className="text-base font-serif"
      >
        <p>
          {t('Parlichart is a free and open source civics project developed in Izmir to view the real time and historical state of the Turkish Parliament.')}
        </p>
        <a className="text-emphasis-secondary italic" href={`/${locale}/docs/events`}>
          {t('Read the docs to learn how')}
        </a>
      </div>
    </SectionWrapper>
  );
};
