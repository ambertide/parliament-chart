import { ComponentProps, FC } from "react";
import { ParliamentFigure } from "../ParliamentFigure";
import { ParlichartBanner } from "../ParlichartBanner";

type FigureProps = Omit<ComponentProps<typeof ParliamentFigure>, 'expressChangeMode'>;

export const MainSummaryView: FC<FigureProps> = ({
  representatives,
  partiesOrGroups,
  groupBy,
  ...menuProps
}) => {
  return <div className="flex w-full flex-col gap-8">
    <ParlichartBanner />
    <ParliamentFigure
      partiesOrGroups={partiesOrGroups}
      representatives={representatives}
      groupBy={groupBy}
      {...menuProps}
    />
  </div>;
};
