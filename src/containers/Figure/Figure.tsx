import { ParliamentFigure } from "@/components";
import { sortParties } from "@/hooks";
import { Party, Representative } from "@/types";
import { FC } from "react";

type FigureProps = {
  groupBy: 'deputies' | 'groups' | 'alliance',
  numberOfRepresentatives: number,
  chartData: Representative[],
  sortedParties: [string, Party[]][] | Party[]
};

export const Figure: FC<FigureProps> = ({
  groupBy,
  chartData,
  sortedParties
}) => {
  return <ParliamentFigure
    partiesOrGroups={sortedParties as unknown as any}
    representatives={chartData}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupBy={groupBy as any}
  />;
};