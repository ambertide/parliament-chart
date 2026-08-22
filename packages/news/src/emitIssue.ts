import { Octokit } from 'octokit';
import { News } from './news';

const REPO_CONSTS = { owner: 'ambertide', repo: 'parliament-chart'};

const createBody = (news: News[]) => {
  return `
  | Title | Link |
  | --- | --- |
  ${news.reduce((accum, { title, link}) => `${accum}\n|${title} | ${link}}|`, '')}
  `;
};

export const emitIssue = async (news: News[]) => {
  const octokit = new Octokit({ auth: ``});
  const maybeTitle = `EWS: Possible Updates for ${(new Date()).toDateString()}`;
  let issue = (await octokit.rest.issues.list({
    ...REPO_CONSTS,
    repo: 'parliament-chart',
    title: maybeTitle
  })).data[0];
  if (!issue) {
    issue = (await octokit.rest.issues.create({
      ...REPO_CONSTS,
      title: maybeTitle,
      body: `Possible changes in parliament detected for ${new Date().toDateString()}, following news articles tripped the EWSfP`
    })).data;
  }
  await octokit.rest.issues.createComment({
    ...REPO_CONSTS,
    issue_number: issue.number,
    body: createBody(news)
  });
};
