import { ParliamentView } from "@/components";
import { chartData as data } from "@parlichart/events";
import type { Snapshot } from "@parlichart/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  const languages = ['en', 'tr'];
  const paths = Object.entries(data).flatMap(
    ([term, milestonesOfTerm]) => Object.values(milestonesOfTerm).flatMap(({ slug: milestone }) => languages.map(lang => ({
      params: {
        lang,
        term,
        milestone
      },
    }))));
  console.log(paths.map(({ params: { lang, term, milestone }}) => `Emitting ${lang}/term/${term}/${milestone}`).join('\n'));
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<{term: string | string[] | undefined, lang: string | string[] | undefined, milestone: string | string[] | undefined}> = async ({ params: { term, lang, milestone } = {term: '28', lang: 'en'}}) => {
  const milestonesOfTerm = data[term as keyof typeof data];
  const chartData = (Object.values((data)[term as keyof typeof data]).find(({slug}) => slug === milestone)?.['snapshot']) ?? { parties: []};
  const messages = (await import(`../../../../../messages/${lang}.json`)).default;
  return { props: { term, lang, messages, milestone, milestonesOfTerm, chartData }};
};

export default function Term({ term, lang, milestone, milestonesOfTerm, chartData }: { chartData: Snapshot, term: `${number}`, lang: string, milestone: string, milestonesOfTerm: Record<string, { date: string, slug: string }> }) {
  const t = useTranslations('Term');
  const selectedTerm = useMemo(() => Number.parseInt(term), [term]);
  const [groupBy, setGroupBy] = useState<'alliance' | 'deputies'>('deputies');
  const { push } = useRouter();
  return (
    <ParliamentView
      groupBy={groupBy}
      partiesOrGroups={chartData[groupBy].sortedParties}
      representatives={chartData[groupBy].representatives}
      selectedTerm={selectedTerm}
      selectedMilestone={milestone}
      milestonesOfTerm={milestonesOfTerm}
      onMilestoneSelect={newMilestone => push(`/${lang}/terms/${term}/${newMilestone}`)}
      onTermSelect={term => push(`/${lang}/terms/${term}`)}
      onDisplayOptionChange={e => setGroupBy(e as 'alliance' | 'deputies')}
      selectedDisplayOption={groupBy}
      displayOptions={[
        { value: 'alliance', displayValue: t('electoralAlliance')},
        { value: 'deputies', displayValue: t('numberOfRepresentatives')}
      ]}
    />
  );
}
