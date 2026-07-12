import Layout from '../components/Layout';
import '@/assets/globals.css';
import { Header } from '@/components';
import { NextIntlClientProvider} from 'next-intl';

/** @ts-ignore: I can't be bothered to deal with this */
export default function MyApp({ Component, pageProps }) {
  return (
    <NextIntlClientProvider
      timeZone={"Europe/Istanbul"}
      locale={pageProps.lang ?? 'en'}
      messages={pageProps.messages ?? {}}
    >
      <Layout>
        <div
          className="h-full flex flex-col"
        >
          <Header />
          <Component {...pageProps} />
        </div>
      </Layout>
    </NextIntlClientProvider>
  );
}
