import terms from "@/assets/terms.json";
import { ParliamentFigure } from "@/components";
import { Menu } from "@/components/Menu/Menu";
import { Party } from "@/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

const validTerms = Object.keys(terms).filter(key => Number.parseInt(key) >= 20);


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = validTerms.map(term => ({
    params: {
      term,
    },
  }));
  console.log(paths);
  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps<{parties: Party[], term: string | string[] | undefined}> = async ({ params: { term } = {term: '28'}}) => {
  const { parties } = terms[term as keyof typeof terms]
  return { props: { parties, term }};
}

export default function Term({ parties, term }: { parties: Party[], term: `${number}` }) {
  const selectedTerm = useMemo(() => Number.parseInt(term), [term]);
  const { push } = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <ParliamentFigure
          groupBy="alliance"
          parties={parties}
        />
        <Menu
          selectedTerm={selectedTerm}
          onTermSelect={term => push(`/terms/${term}`)}
        />
      </main>
    </div>
  );
}
