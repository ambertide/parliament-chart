import en from '../messages/en.json';
import tr from '../messages/tr.json';

const messagesByLocale: Record<string, unknown> = {en, tr};

const nextIntl = {
  defaultLocale: 'en',
  messagesByLocale,
};

export default nextIntl;