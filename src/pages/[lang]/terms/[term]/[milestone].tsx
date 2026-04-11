import milestones from "@/assets/milestones.json";
import { ParliamentFigure } from "@/components";
import { Menu } from "@/components/Menu/Menu";
import { Party } from "@/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  const languages = ['en', 'tr']
  const paths = Object.entries(milestones).flatMap(
    ([term, milestonesOfTerm]) => Object.values(milestonesOfTerm).flatMap(({ slug: milestone }) => languages.map(lang => ({
      params: {
        lang,
        term,
        milestone
      },
    }))));
  console.log(paths.map(({ params: { lang, term, milestone }}) => `Emitting ${lang}/term/${term}/${milestone}`).join('\n'))
  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps<{parties: Party[], term: string | string[] | undefined, lang: string | string[] | undefined, milestone: string | string[] | undefined}> = async ({ params: { term, lang, milestone } = {term: '28', lang: 'en'}}) => {
  const milestonesOfTerm = milestones[term as keyof typeof milestones]
  const { parties } = Object.values(milestones[term as keyof typeof milestones]).find(({slug}) => slug === milestone )?.['snapshot'] ?? { parties: []}
  const messages = (await import(`../../../../../messages/${lang}.json`)).default
  return { props: { parties, term, lang, messages, milestone, milestonesOfTerm }};
}

export default function Term({ parties, term, lang, milestone, milestonesOfTerm }: { parties: Party[], term: `${number}`, lang: string, milestone: string, milestonesOfTerm: Record<string, { date: string, slug: string }> }) {
  const t = useTranslations('Term');
  const selectedTerm = useMemo(() => Number.parseInt(term), [term]);
  const [groupBy, setGroupBy] = useState<'alliance' | 'groups' | 'deputies'>('alliance');
  const { push } = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-16 py-32 px-16 sm:items-start">
        <ParliamentFigure
          groupBy={groupBy}
          parties={parties}
          numberOfRepresentatives={selectedTerm >= 27 ? 600 : 550}
        />
        <Menu
          selectedTerm={selectedTerm}
          selectedMilestone={milestone}
          milestonesOfTerm={milestonesOfTerm}
          onMilestoneSelect={newMilestone => push(`/${lang}/terms/${term}/${newMilestone}`)}
          onTermSelect={term => push(`/${lang}/terms/${term}`)}
          onDisplayOptionChange={e => setGroupBy(e as 'alliance' | 'groups' | 'deputies')}
          selectedDisplayOption={groupBy}
          displayOptions={[
            { value: 'alliance', displayValue: t('electoralAlliance')},
            { value: 'deputies', displayValue: t('numberOfRepresentatives')},
            { value: 'groups', displayValue: t('parliamentaryGroups') }
          ]}
        />
      </main>
    </div>
  );
}
