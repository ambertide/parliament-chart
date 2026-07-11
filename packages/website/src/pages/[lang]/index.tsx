import { MainSummaryView } from "@/components";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { chartData as data } from "@parlichart/events";
import { Snapshot } from "@parlichart/types";
import { useTranslations } from "next-intl";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [ { params: { lang: 'en'} }, { params: { lang: 'tr'}}];
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<{lang: string | string[] | undefined}> = async ({ params: { lang } = {lang: 'en'}}) => {
  const messages = (await import(`../../../messages/${lang}.json`)).default;
  const chartData = (data["28" as keyof typeof data])["Present Day"]["snapshot"] as Snapshot;
  return { props: { lang, messages, chartData }};
};

const MainPage = ({ chartData }: { chartData: Snapshot }) => {
  const [groupBy, onGroupByChange] = useState<'deputies' | 'alliance'>('deputies');
  const t = useTranslations('Term');
  return (
    <MainSummaryView
      partiesOrGroups={chartData[groupBy].sortedParties}
      groupBy={groupBy}
      representatives={chartData[groupBy].representatives}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDisplayOptionChange={onGroupByChange as any}
      selectedDisplayOption={groupBy}
      displayOptions={[
        { value: 'alliance', displayValue: t('electoralAlliance')},
        { value: 'deputies', displayValue: t('numberOfRepresentatives')}
      ]}
      onTermSelect={f => f}
      onMilestoneSelect={f => f}
      milestonesOfTerm={{
        "Present Day" : {
          "slug": "current",
          "date": "2026-07-01T00:00:00.000Z"
        }
      }}
      selectedMilestone="current"
      selectedTerm={28}
    />
  );
};

export default MainPage;
