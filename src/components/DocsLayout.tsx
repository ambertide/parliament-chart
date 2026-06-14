import { FC, PropsWithChildren, useMemo } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { useLocale, useTranslations } from "next-intl";
import { docsPages } from "@/docs";

export const DocsLayout: FC<PropsWithChildren> = ({ children }) => {
  const locale = useLocale();
  const t = useTranslations('DocsSidebar');
  const links = useMemo(() => (
    docsPages
      .filter(({ availableIn }) => locale in availableIn)
      .map(({ slug, title }) => ({
        link: `/${locale}/docs/${slug}`,
        title: t(title)
      }))
  ), [
    locale,
    t
  ]);
  return (<div className="w-full h-full flex">
    <aside
      className="min-w-64"
    >
      <DocsSidebar
        links={links} 
      />
    </aside>
    <section
      className="grow block"
    >
      {children}
    </section>
  </div>);
};