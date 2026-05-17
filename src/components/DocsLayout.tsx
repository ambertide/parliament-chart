import { FC, PropsWithChildren } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { useLocale, useTranslations } from "next-intl";

export const DocsLayout: FC<PropsWithChildren> = ({ children }) => {
  const locale = useLocale();
  const t = useTranslations('DocsSidebar');
  return (<div className="w-full h-full flex">
    <aside
      className="min-w-64"
    >
      <DocsSidebar
        links={[
          {
            link: `/docs/${locale}/events`,
            title: t("Parlevents")
          },
          {
            link: `/docs/${locale}/attribution`,
            title: t("Attribution")
          }
        ]} 
      />
    </aside>
    <section
      className="grow block"
    >
      {children}
    </section>
  </div>);
};