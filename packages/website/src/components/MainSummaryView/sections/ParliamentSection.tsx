import { useTranslations } from "next-intl";
import { SectionWrapper } from "./SectionWrapper";
import { FC, PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";

export const ParliamentSection: FC<PropsWithChildren<{className: string}>> = ({ children, className }) => {
  const t = useTranslations('Sections');
  const { push} = useRouter();
  useEffect(() => {
    console.log('am I even runnning?????');
    window.addEventListener("pageswap", (event) => {
      console.log('yes');
      if (event.viewTransition) {
        event.viewTransition.finished.catch((err) => {
          // Log it, send it to your analytics, whatever
          console.warn("Outgoing transition aborted:", err.name);
        });
      }
    });
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
