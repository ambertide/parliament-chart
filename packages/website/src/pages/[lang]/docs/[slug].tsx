import { DocsLayout } from "@/components";

import { GetStaticPaths, GetStaticProps } from "next";
import { docsPages } from '@/docs';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = docsPages.flatMap(
    ({ slug, availableIn}) => Object.keys(availableIn).map(lang => ({
      params: {
        lang,
        slug,
      },
    })));
  console.log(paths.map(({ params: { lang, slug }}) => `Emitting ${lang}/docs/${slug}`).join('\n'));
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<{slug: string | string[] | undefined, lang: string | string[] | undefined}> = async ({ params: { lang, slug } = {slug: 'ai_usage', lang: 'en'}}) => {
  const messages = (await import(`../../../../messages/${lang}.json`)).default;
  return { props: { lang, messages, slug }};
};

const NoOp = () => <></>;

export default function Term({ lang, slug }: { slug: string, lang: string }) {
  const Content = docsPages.find(({ slug: pageSlug }) => pageSlug === slug)?.availableIn[lang as 'tr' | 'en'] ?? NoOp;
  console.log(Content);
  return (
    <DocsLayout>
      <Content />
    </DocsLayout>
  );
}

