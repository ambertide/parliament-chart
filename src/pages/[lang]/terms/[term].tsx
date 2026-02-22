import terms from "@/assets/terms.json";
import { ParliamentFigure } from "@/components";
import { Menu } from "@/components/Menu/Menu";
import { Party } from "@/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const validTerms = Object.keys(terms).filter(key => Number.parseInt(key) >= 20);

export const getStaticPaths: GetStaticPaths = async () => {
  const languages = ['en', 'tr']
  const paths = validTerms.flatMap(term => languages.map(lang => ({
    params: {
      lang,
      term,
    },
  })));
  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps<{parties: Party[], term: string | string[] | undefined, lang: string | string[] | undefined}> = async ({ params: { term, lang } = {term: '28', lang: 'en'}}) => {
  const { parties } = terms[term as keyof typeof terms]
  const messages = (await import(`../../../../messages/${lang}.json`)).default
  console.log(messages);
  return { props: { parties, term, lang, messages }};
}

export default function Term({ parties, term, lang }: { parties: Party[], term: `${number}`, lang: string }) {
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
