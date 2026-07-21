import { execSync } from 'node:child_process';
import { milestones } from '@parlichart/events';

const resolveDeltas = (
  from: string,
  to: string
) => {
  const partyDelta = milestones['28']['Present Day'].snapshot.partyDelta;
  const dateFrom = new Date(from);
  const dateTo = new Date(to);
  console.log(from, to, dateFrom, dateTo);
  const partyDeltaFiltered = partyDelta.map(({ date, ...rest }) => ({ ...rest, date: Date.parse(date) })).filter(({ date }) => dateFrom <= date && date <= dateTo);
  console.log(partyDeltaFiltered);
  const changeSum = partyDeltaFiltered.reduce((accum, { increase, decrease }) => ({
    ...accum,
    [increase]: (accum[increase] ?? 0) + 1,
    [decrease]: (accum[decrease] ?? 0) - 1
  }), {} as Record<string, number>);
  return changeSum;
};

export const getSocialMediaDescription = () => {
  const gitTrailerBody = execSync('git log -1 --pretty=%B | git interpret-trailers --parse').toString();
  const gitTrailers = Object.fromEntries(
    gitTrailerBody.split('\n').map(headerLine => {
      const [trailer, ...rest] = headerLine.split(':');
      return [trailer, rest.join(':').trim()];
    })
  );
  console.log(gitTrailers);
  const {
    'Social-Media-Update-Date-From': socialMediaUpdateDateFrom,
    'Social-Media-Update-Date-To': socialMediaUpdateDateTo,
    'Social-Media-Update-Details': socialMediaUpdateDetails
  } = gitTrailers;
  if (!socialMediaUpdateDateFrom || !socialMediaUpdateDateTo) {
    return false;
  } else {
    return {
      delta: resolveDeltas(
        socialMediaUpdateDateFrom,
        socialMediaUpdateDateTo
      ),
      details: socialMediaUpdateDetails
    };
  }
};


console.log(getSocialMediaDescription());
