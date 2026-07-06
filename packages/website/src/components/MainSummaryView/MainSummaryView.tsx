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
  return <div className="flex grow h-full flex-col items-start gap-8">
    <ParlichartBanner />
    <ParliamentFigure
      partiesOrGroups={partiesOrGroups}
      representatives={representatives}
      groupBy={groupBy}
      {...menuProps}
    />
  </div>;
};
