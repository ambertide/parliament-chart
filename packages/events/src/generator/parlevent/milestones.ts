import { readFile } from "fs/promises";
export const governmentMap = {
  20: [53, 54, 55, 56],
  21: [57],
  22: [58, 59],
  23: [60],
  24: [61, 62],
  25: [63, 64],
  26: [65],
  27: [66],
  28: [67],
};

export const termData = Object.fromEntries(
  [
    /**   [20, "1996-01-08", "1999-03-25"],
    [21, "1999-05-02", "2002-10-01"],
    [22, "2002-11-14", "2007-06-03"],
    [23, "2007-07-23", "2011-04-23"],
    [24, "2011-06-28", "2015-04-23"],
    [25, "2015-06-23", "2015-10-01"],
    [26, "2015-10-17", "2018-05-16"], */
    [27, "2018-07-07", "2023-05-14"],
    // last date given as latest possible date for elections of 2028
    [28, "2023-06-02", "2028-05-14"],
  ].map(([term, start, end]) => [
    term,
    {
      start: new Date(start),
      end: new Date(end),
      representativeCount: (term as number) < 27 ? 550 : 600,
      governmentType: (term as number) < 27 ? "Parliamentary" : "Presidential",
    },
  ]),
);

type MilestoneDeclaration = {
  date: Date,
  name: string,
  slug: string,
  description?: string
};


export const getMilestones = async (): Promise<{ [term: string]: MilestoneDeclaration[] }> => {
  const { terms: milestonesPerTerm } = JSON.parse(
    await readFile("src/include/milestone.declarations.json", "utf-8"),
  );

  return Object.fromEntries(
    Object.entries(termData).map(([term, { start }]) => [
      term,
      [
        {
          date: start,
          name: `${term}_PARLIAMENT_FORMATION`,
          slug: 'formation'
        },
        ...(milestonesPerTerm[term as "28"]?.["milestones"].map(
          ({ date, ...rest }: { date: string }) => ({
            date: new Date(date),
            ...rest,
          }),
        ) ?? []),
      ],
    ]),
  );
};
