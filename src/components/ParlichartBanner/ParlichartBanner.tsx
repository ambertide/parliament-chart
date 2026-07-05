
import { useLocale, useTranslations } from 'next-intl';
import { FC, useMemo } from 'react';

export const ParlichartBanner: FC<Record<never, never>> = () => {
  const t = useTranslations('Banner');
  const locale = useLocale();
  const link = useMemo(() => `/${locale}/terms/28/current`, [locale]);
  return (
    <div className="text-emphasis w-full">
      <div className="h-fit w-full bg-emphasis-tertiary items-center font-serif-degraded px-4 py-1">
        <div className="md:flex md:items-center md:flex-row md:justify-between">
          <h1 className="text-xl sm:text-4xl font-bold">{t('28th Parliament')}</h1>
          <span className="hidden sm:inline text-2xl font-bold">{t('Elections no later than May 14, 2028')}</span>
          <span className="sm:hidden text-base font-semibold sm:font-bold truncate">{t('Elections on 14/05/2028')}</span>
        </div>
      </div>
      <div className="text-xs sm:text-base h-7 w-full bg-activity-inactive-secondary flex justify-between items-center flex-row text-emphasis px-4">
        <span className="hidden sm:inline">
          {t('Parliament in Session since May 14, 2023')}
        </span>
        <span className="sm:hidden">
          {t('Innagurated on 14/05/2023')}
        </span>
        <a
          className="italic sm:hidden"
          href={link}
        >
          {t('History')}
        </a>
        <a
          className="italic hidden sm:inline"
          href={link}
        >
          {t('Browse historical data')}
        </a>
      </div>
    </div>
  );
};
