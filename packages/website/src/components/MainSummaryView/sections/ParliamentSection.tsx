import { useLocale, useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";
import { FC, PropsWithChildren, useCallback, useMemo } from "react";

export const ParliamentSection: FC<PropsWithChildren<{className: string}>> = ({ children, className }) => {
  const t = useTranslations('Sections');
  const locale = useLocale();
  const routerPush = useCallback((loc: string) => {
    window.location.href = loc;
  }, []);
  const windowPush = useCallback((loc: string) => {
    window.location.assign(loc);
  }, []);
  // Sth sth view animations only work the way I did in MPAs and tho
  // we take stat. export so in prod we have a MPA but in the godforsoken
  // application that is the NextJS the dev environemnt is an SPA so
  // I have to force navigation to properly test or some other blsht.
  const push = useMemo(() => process.env.NODE_ENV === 'development' ? windowPush : routerPush, [windowPush, routerPush]); 
  return <SectionWrapper
    className={className}
    title={t('Browse the Parliament\'s Status')}
    onClick={() => push(`${locale}/terms/28/current`)}
  >
    <div
      className="pointer-events-none w-full h-full"
    >
      {children}
    </div>
  </SectionWrapper>;
};
