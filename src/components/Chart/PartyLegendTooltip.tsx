import { useLocale, useTranslations } from "next-intl"
import { FC } from "react"

type PartyLegendTooltipProps = {
  canonicalLongName: string,
  representativeCount: number,
  allianceName: string,
  anchorName: string
}

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
  anchorName
}) => {
  const locale = useLocale();
  const t = useTranslations('Parties');
  return <div
    className="hidden group-hover/party-legend-item:flex bg-background-secondary px-2 min-w-1/5 flex-col absolute"
    style={{
      positionAnchor: anchorName,
      left: "anchor(right)",
      top: "anchor(bottom)",
    }}
  >
    <span className="text-emphasis">{canonicalLongName}</span>
    {locale !== 'tr' && canonicalLongName !== "Bağımsız" && <span>{t(canonicalLongName)}</span>}
    {allianceName && <span>{t('MemberOf', { allianceName: t(allianceName) })}</span>}
    <span>{t('SeatCount', { seats: representativeCount})}</span>
  </div>
}