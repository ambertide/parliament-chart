import dynamic from 'next/dynamic';
import { FC, PropsWithChildren, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { docsPages } from "@/docs";

 
const DocsSidebar = dynamic(() => import('../components/DocsSidebar'), { ssr: false });

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
  return (
    <div className="w-full h-full flex px-2">
      <DocsSidebar
        links={links} 
      />
      <section
        className="grow block max-w-full"
      >
        <main
          className="font-sans text-sm"
        >
          {children}
        </main>
      </section>
    </div>);
};
