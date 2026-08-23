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
  const octokit = new Octokit({ auth: ``});
  const maybeTitle = `EWS: Possible Updates for ${(new Date()).toDateString()}`;
  let issue = (await octokit.rest.issues.listForRepo({
    ...REPO_CONSTS,
    title: maybeTitle
  })).data[0];
  if (!issue) {
    console.log('Did not find any issues, assigning new.');
    issue = (await octokit.rest.issues.create({
      ...REPO_CONSTS,
      title: maybeTitle,
      labels: [{
        name: 'EWSfP'
      }],
      body: `Possible changes in parliament detected for ${new Date().toDateString()}, following news articles tripped the EWSfP`
    })).data;
  }
  await octokit.rest.issues.createComment({
    ...REPO_CONSTS,
    issue_number: issue.number,
    body: createBody(news)
  });
};
