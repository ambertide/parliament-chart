import Layout from '../components/Layout';
import '@/assets/globals.css';
import { LanguageSelect } from '@/components';
import { NextIntlClientProvider} from 'next-intl';

/** @ts-ignore: I can't be bothered to deal with this */
export default function MyApp({ Component, pageProps }) {
  return (
    <NextIntlClientProvider
      locale={pageProps.lang ?? 'en'}
      messages={pageProps.messages}
    >
      <Layout>
        <LanguageSelect />
        <Component {...pageProps} />
      </Layout>
    </NextIntlClientProvider>
  );
}