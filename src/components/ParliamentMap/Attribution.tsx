import { useLocale, useTranslations } from "next-intl";

export const Attribution = () => {
  const locale = useLocale();
  const t = useTranslations('Attribution');
  return <span className="absolute bottom-0 right-0 text-sm text-foreground opacity-25 max-w-1/2">
    <span className="text-emphasis">©</span> <a href={`/docs/${locale}/attribution`}>{t('Attribution')}</a>
  </span>;
};