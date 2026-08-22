import { emitIssue } from './emitIssue';
import { collectNews } from './news';

collectNews().then(async nS => {
  if (nS.length) {
    console.info(`Found ${nS.length} news articles, EWSfP tripped.`);
    await emitIssue(nS);
  } else {
    console.log(`Found no news articles matching trigger rules.`);
  }
}).then(() => process.exit(0));
