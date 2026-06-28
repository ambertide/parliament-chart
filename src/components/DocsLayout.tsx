import { FC, PropsWithChildren, useMemo } from "react";
import { DocsSidebar } from './DocsSidebar';
import { useLocale, useTranslations } from "next-intl";
import { docsPages } from "@/docs";
import { useRouter } from 'next/router';

export const DocsLayout: FC<PropsWithChildren> = ({ children }) => {
  const locale = useLocale();
  const t = useTranslations('DocsSidebar');
  const router = useRouter();
  const links = useMemo(() => (
    docsPages
      .filter(({ availableIn }) => locale in availableIn)
      .map(({ slug, title }) => ({
        link: `/${locale}/docs/${slug}`,
        title: t(title),
        current: router.asPath === `/${locale}/docs/${slug}`
      }))
  ), [
    locale,
    router,
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
