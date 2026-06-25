import { useLocale, useTranslations } from "next-intl";
import { BasicSelect } from "./common";
import { useRouter } from "next/router";
import { useCallback } from "react";

export const LanguageSelect = () => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Utils');
  const onLanguageChange = useCallback((newLocale: string|number) => {
    const newPath = router.asPath.replace(`/${locale}/`, `/${newLocale}/` as string);
    router.push(newPath);
  }, [
    locale,
    router
  ]);
  return (
    <div
      className="p-1 bg-background-secondary gap-1 flex align-bottom"
    >
      <label
        htmlFor="locale-select"
        className="not-italic font-ligature"
      >
        &#xe8e2;
        <span className="sr-only">
          {t('SwitchLanguage')}
        </span>
      </label>
      <BasicSelect
        id="locale-select"
        onChange={onLanguageChange}
        selectedValue={locale}
        className="text-foreground-secondary field-sizing-fixed"
        options={[
          {
            displayValue: "Türkçe",
            value: "tr"
          },
          {
            displayValue: "English (UK)",
            value: "en"
          }
        ]}
      />
    </div>
  );
};