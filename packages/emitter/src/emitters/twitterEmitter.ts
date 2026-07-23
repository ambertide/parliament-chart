import { Emitter } from "./Emitter";
import { partyUtils } from '@parlichart/events';
import { 
  Client, 
  OAuth1,
  type OAuth1Config,
  type ClientConfig
} from '@xdevplatform/xdk';

const twitterClient = () => {
  // @ts-ignore: holly shit the official twitter api example is wrong lmao
  const oauth1Config: OAuth1Config = {
    apiKey: process.env.TWITTER_API_KEY ?? '',
    apiSecret: process.env.TWITTER_API_SECRET ?? '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };

  const oauth1: OAuth1 = new OAuth1(oauth1Config);

  const config: ClientConfig = {
    oauth1: oauth1
  };

  const client: Client = new Client(config);
  return client;
};

const formatPartyName = (partyName: string) => {
  const party = partyUtils.parties.find(({ canonicalLongName }) => canonicalLongName === partyName);
  if (party) {
    const { boxEmoji, fourLetterShortName } = party;
    return `${boxEmoji} ${fourLetterShortName}`;
  }
};

const formatPartyChange = (partyChange: number) => {
  if (partyChange > 0) {
    return `+${partyChange}`;
  }
  return partyChange;
};

const createTwitterPostBodyFromDelta = (delta: Record<string, number>) => {
  const additions = Object.fromEntries(Object.entries(delta).filter(([_partyName, change]) => change > 0));
  const removals = Object.fromEntries(Object.entries(delta).filter(([_partyName, change]) => change < 0));

  return Object.entries({
    ...additions,
    ...removals
  }).map(
    ([partyName, partyChange]) =>
      `${formatPartyName(partyName) ?? partyName} ${formatPartyChange(partyChange)}`
  ).join('\n');
};

export const twitterEmitter: Emitter = async ({
  delta,
  details
}) => {
  const client = twitterClient();
  const response = await client.posts.create({
    text: `mecliste bugünkü koltuk değişimlerinin özeti:

${createTwitterPostBodyFromDelta(delta)}
` + (details ? `\n${details}` : '')
  });

  const me = response.data;
  console.log(me);
  return true;
};
