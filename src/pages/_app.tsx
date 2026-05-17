import Layout from '../components/Layout';
import '@/assets/globals.css';
import { Header, DocsLayout } from '@/components';
import { NextIntlClientProvider} from 'next-intl';

/** @ts-ignore: I can't be bothered to deal with this */
export default function MyApp({ Component, pageProps, router }) {
  const isDocsRoute = router.route.startsWith('/docs');
  return (
    <NextIntlClientProvider
      locale={pageProps.lang ?? 'en'}
      messages={pageProps.messages ?? {}}
    >
      <Layout>
        <div
          className="h-full flex flex-col"
        >
          <Header />
          <main
            className="grow flex items-center justify-center"
          >
            {isDocsRoute ?
              <DocsLayout>
                <Component {...pageProps} />
              </DocsLayout>
              : <Component {...pageProps} />}
          </main>
        </div>
      </Layout>
    </NextIntlClientProvider>
  );
}