import { Octokit } from 'octokit';
import { News } from './news';


const REPO_CONSTS = { owner: 'parlichart', repo: 'parlichart'};

const createBody = (news: News[]) => {
  return `
  Following RSS news articles were updates since last run:

  | Title | Link |
  | --- | --- |
  ${news.reduce((accum, { title, link}) => `${accum}|${title} | ${link}|\n`, '')}
  `;
};

export const emitIssue = async (news: News[]) => {
  if (!process.env.EWSFP_GITHUB_PAT) {
    console.error('Unable to lock EWSfP Github PAT');
    process.exit(1);
  }
  const octokit = new Octokit({ auth: process.env.EWSFP_GITHUB_PAT });
  const maybeTitle = `EWS: Possible Updates for ${(new Date()).toDateString()}`;
  let issue = (await octokit.rest.issues.listForRepo({
    ...REPO_CONSTS,
    state: 'open',
    title: maybeTitle
  })).data[0];
  if (!issue || issue.title !== maybeTitle) {
    console.log('Did not find any issues, assigning new.');
    issue = (await octokit.rest.issues.create({
      ...REPO_CONSTS,
      title: maybeTitle,
      labels: [{
        name: 'EWSfP'
      }],
      assignees: ['ambertide'],
      body: `Possible changes in parliament detected for ${new Date().toDateString()}, following news articles tripped the EWSfP`
    })).data;
  }
  await octokit.rest.issues.createComment({
    ...REPO_CONSTS,
    issue_number: issue.number,
    body: createBody(news)
  });
};
