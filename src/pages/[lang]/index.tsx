import { ParlichartBanner } from "@/components";
import { GetStaticPaths, GetStaticProps } from "next";

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
  return { props: { lang, messages }};
};

const MainPage = () => (
  <ParlichartBanner/>
);

export default MainPage;