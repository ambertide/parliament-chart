import data from "@/assets/data.generated.json";
import { Menu } from "@/components/Menu/Menu";
import { Figure } from "@/containers";
import { ChartData, Snapshot } from "@/types/ChartData";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  const languages = ['en', 'tr'];
  const paths = Object.entries(data as unknown as ChartData).flatMap(
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
  const chartData = (Object.values((data as unknown as ChartData)[term as keyof typeof data]).find(({slug}) => slug === milestone)?.['snapshot']) ?? { parties: []};
  const messages = (await import(`../../../../../messages/${lang}.json`)).default;
  return { props: { term, lang, messages, milestone, milestonesOfTerm, chartData }};
};

export default function Term({ term, lang, milestone, milestonesOfTerm, chartData }: { chartData: Snapshot, term: `${number}`, lang: string, milestone: string, milestonesOfTerm: Record<string, { date: string, slug: string }> }) {
  const t = useTranslations('Term');
  const selectedTerm = useMemo(() => Number.parseInt(term), [term]);
  const [groupBy, setGroupBy] = useState<'alliance' | 'deputies'>('deputies');
  const { push } = useRouter();
  return (
    <div className="flex flex-col gap-8">
      <Figure
        groupBy={groupBy}
        sortedParties={chartData[groupBy].sortedParties}
        numberOfRepresentatives={selectedTerm >= 27 ? 600 : 550}
        chartData={chartData[groupBy].representatives}
      />
      <Menu
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
    </div>
  );
}
