import { MainSummaryView } from "@/components";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import data from "@/assets/data.generated.json";
import { Snapshot } from "@/types/ChartData";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [ { params: { lang: 'en'} }, { params: { lang: 'tr'}}];
  console.log(paths.map(({ params: { lang }}) => `Emitting ${lang}}`).join('\n'));
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<{lang: string | string[] | undefined}> = async ({ params: { lang } = {lang: 'en'}}) => {
  const messages = (await import(`../../../messages/${lang}.json`)).default;
  const chartData = (data["28" as keyof typeof data] as any)["Present Day"]["snapshot"] as Snapshot;
  return { props: { lang, messages, chartData }};
};

const MainPage = ({ chartData }: { chartData: Snapshot }) => {
  const [groupBy, onGroupByChange] = useState<'deputies' | 'alliance'>('deputies');
  return (
    <MainSummaryView
      groupBy={groupBy}
      onGroupByChange={onGroupByChange}
      partiesOrGroups={chartData[groupBy].sortedParties}
      representatives={chartData[groupBy].representatives}
    />
  );
};

export default MainPage;
