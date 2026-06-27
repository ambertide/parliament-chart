import { useLocale, useTranslations } from "next-intl";
import { LanguageSelect } from "../LanguageSelect";

export const Header = () => {
  const locale = useLocale();
  const t = useTranslations('Header');
  return (<header
    className="w-full flex flex-row justify-between items-center shrink"
  >
    <nav
      className="flex flex-row gap-2.5 text-foreground-secondary text-sm font-semibold font-serif-degraded"
    >
      <a href={`/${locale}`}>{t('HOME')}</a>
      <a href={`/${locale}/docs/events`}>{t('DOCS')}</a>
    </nav>
    <LanguageSelect />
  </header>);
};