// ?react may look unimportant but is actually necessary for storybook
// down the line.
import ChartBanner from '@/assets/images/ChartBanner.svg';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export const ParlichartBanner: FC<Record<never, never>> = () => {
  const t = useTranslations('Banner');
  return (
    <div className="text-emphasis w-full">
      <div className="h-22 w-full flex flex-row gap-8 bg-emphasis-tertiary font-serif-degraded px-4 py-3">
        <ChartBanner
          className="min-w-29.5"
        />
        <div>
          <h1 className="text-xl sm:text-4xl font-bold">{t('28th Parliament')}</h1>
          <span className="hidden sm:inline-block text-2xl font-bold">{t('Elections no later than May 14, 2028')}</span>
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
          href=''
        >
          {t('History')}
        </a>
        <a
          className="italic hidden sm:inline"
          href=''
        >
          {t('Browse historical data')}
        </a>
      </div>
    </div>
  );
};
