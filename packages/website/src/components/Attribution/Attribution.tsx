import CCBySA from '@/assets/images/icons/ccbysa.svg';
import { useLocale, useTranslations } from 'next-intl';

export const Attribution = ({ className }: { className: string }) => {
  const locale = useLocale();
  const t = useTranslations('GENERAL_ATTRIBUTION');
  return <small className={`text-sm text-foreground flex max-sm:flex-col gap-2 ${className}`}>
    <CCBySA className="h-3.5" />
    <span>
      {t('TEXT')}
      <a
        className="text-emphasis-secondary"
        href={`/${locale}/docs/attribution`}
      >
        {t('DETAILS')}
      </a>
    </span>
  </small>;
};
