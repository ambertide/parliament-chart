import { useLocale, useTranslations } from "next-intl";
import { FC, RefObject } from "react";

type PartyLegendTooltipProps = {
  canonicalLongName: string,
  representativeCount: number,
  allianceName: string,
  anchor: RefObject<HTMLElement | null>
};

/**
 * Since space is premium the full name of the parties
 * is only described here, in turkish we only show
 * the turkish name but in english we show the translation
 * also.
 */
export const PartyLegenedTooltip: FC<PartyLegendTooltipProps> = ({
  canonicalLongName,
  representativeCount,
  allianceName,
  anchor
}) => {
  const locale = useLocale();
  const t = useTranslations('Parties');
  return <dialog
    className="hidden z-10 text-foreground -translate-y-full -translate-x-full group-hover/party-legend-item:flex bg-background border-2 border-background-secondary px-2 py-1 min-w-3xs flex-col fixed"
    style={{
      left: anchor.current?.getBoundingClientRect().left,
      top: anchor.current?.getBoundingClientRect().top,
    }}
  >
    <span className="text-emphasis">{canonicalLongName}</span>
    {locale !== 'tr' && canonicalLongName !== "Bağımsız" && <span className="text-emphasis-secondary italic">{t(canonicalLongName)}</span>}
    {allianceName && <span>{t('MemberOf', { allianceName: t(allianceName) })}</span>}
    <span>{t('SeatCount', { seats: representativeCount})}</span>
  </dialog>;
};
