import Parser from 'rss-parser';
import { triggerRules } from './triggerRules';

import feeds from './feeds.declarations.json';

export type News = {
  link: string,
  title: string,
  content: string,
  pubDate: string
};


const takeFrom = new Date(new Date().getTime() - 25*24*60*60*1000);

const parseRSS = async (feedURL: string): Promise<News[]> => {
  const parser = new Parser();
  const feed = await parser.parseURL(feedURL);

  return feed.items
    .filter(({ pubDate, date }) => {
      if (pubDate || date) {
        const effectiveDate = pubDate || date;
        try {
          const pubDateDate = new Date(effectiveDate);
          return pubDateDate.getTime() > takeFrom.getTime();
        } catch (_: unknown) {
          return true;
        }
      } else {
        return true;
      }
    })
    .filter(({
      title = '',
      content = '',
      contentSnippet = ''
    }) => triggerRules.some(
      rule => rule(`${title} ${content} ${contentSnippet}`.toLocaleLowerCase('tr-TR'))
    ))
    .map(({
      title = '',
      content = '',
      contentSnippet = '',
      link = '',
      pubDate = '',
      date = ''
    }) => ({
      link,
      content: content || contentSnippet,
      title,
      pubDate: pubDate || date
    }));
};

export const collectNews = async () => {
  const news = await Promise.allSettled(feeds.feeds.map(feed => parseRSS(feed)))
    .then(results => results.filter(({ status }) => status === 'fulfilled'))
    .then(fulfilledResults => (fulfilledResults as PromiseFulfilledResult<News[]>[]).flatMap(({ value }) => value));
  return news;
};
