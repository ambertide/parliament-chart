// @ts-ignore: MDX Broken
import AiUseEn from './en/ai_use.md';
// @ts-ignore: MDX Broken
import AttributionEn from './en/attribution.md';
// @ts-ignore: MDX Broken
import AttributionTr from './tr/attribution.md';
// @ts-ignore: MDX Broken
import EventsEn from './en/events.md';
// @ts-ignore: MDX Broken
import AboutEn from './en/about.md';
// @ts-ignore: MDX Broken
import AboutTr from './tr/about.md';
import { MDXContent } from 'mdx/types';

type DocPage = {
  slug: string,
  title: string,
  availableIn: Partial<Record<'en' | 'tr', MDXContent>>
};

// A list of all docs and its components
export const docsPages: DocPage[] = [
  {
    title: "About",
    slug: "about",
    availableIn: {
      en: AboutEn,
      tr: AboutTr
    }
  },
  {
    title: "AI Use Policy",
    slug: "ai_use",
    availableIn: {
      en: AiUseEn,
    }
  },
  {
    title: "Attributions",
    slug: "attribution",
    availableIn: {
      en: AttributionEn,
      tr: AttributionTr
    }
  },
  {
    title: "Parlevent System",
    slug: "events",
    availableIn: {
      en: EventsEn
    }
  }
];
