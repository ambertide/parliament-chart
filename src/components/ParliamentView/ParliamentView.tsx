import { ComponentProps, FC } from "react";
import { ParliamentFigure } from "../ParliamentFigure";
import { Menu } from "../Menu";

type FigureProps = ComponentProps<typeof ParliamentFigure> & ComponentProps<typeof Menu>;

export const ParliamentView: FC<FigureProps> = ({
  groupBy,
  representatives,
  partiesOrGroups,
  ...menuProps
}) => {
  return <div className="flex flex-col gap-8">
    <ParliamentFigure
      partiesOrGroups={partiesOrGroups}
      representatives={representatives}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      groupBy={groupBy as any}
    />
    <Menu
      {...menuProps}
    />
  </div>;
};