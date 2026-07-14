import { useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";
import { FC, PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

export const ParliamentSection: FC<PropsWithChildren<{className: string}>> = ({ children, className }) => {
  const t = useTranslations('Sections');
  const { push: routerPush } = useRouter();
  const windowPush = useCallback((loc: string) => {
    window.location.assign(loc);
  }, []);
  // Sth sth view animations only work the way I did in MPAs and tho
  // we take stat. export so in prod we have a MPA but in the godforsoken
  // application that is the NextJS the dev environemnt is an SPA so
  // I have to force navigation to properly test or some other blsht.
  const push = useMemo(() => process.env.NODE_ENV === 'development' ? windowPush : routerPush, [windowPush, routerPush]); 
  useEffect(() => {
    const onPageSwap = async (event) => {
      console.log('yes');
      if (event.viewTransition) {
        event.viewTransition.finished.catch((err) => {
          // Log it, send it to your analytics, whatever
          console.warn("Outgoing transition aborted:", err.name);
        });
      }
    };
    window.addEventListener("pageswap", onPageSwap);
    return window.removeEventListener("pageswap", onPageSwap);
  }, []);
  return <SectionWrapper
    className={className}
    title={t('Browse the Parliament\'s Status')}
  >
    <div
      className="h-full w-full"
      onClick={_ => push('en/terms/28/current')}
    >
      {children}
    </div>
  </SectionWrapper>;
};
