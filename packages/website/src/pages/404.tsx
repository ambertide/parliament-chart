import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const messages = (await import(`../../messages/tr.json`)).default;
  // 99% of the website usage is likely Turkish
  // NextJS makes it borderline impossible to translate this page
  // so we will only serve it in Turkish, lol.
  return { props: { messages, lang: 'tr' } };
};

export default function PageNotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="font-bold text-4xl font-serif-degraded">404</h2>
      <p className="text-lg font-serif">Sayfa Bulunamadı</p>
    </div>
  );
}
