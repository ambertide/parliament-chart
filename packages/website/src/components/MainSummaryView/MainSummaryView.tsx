import { ComponentProps, FC } from "react";
import { ParliamentFigure } from "../ParliamentFigure";
import { ParlichartBanner } from "../ParlichartBanner";
import {
  AboutSection,
  ParliamentSection,
  SocialsSection,
  AttributionSection
} from './sections';

type FigureProps = Omit<ComponentProps<typeof ParliamentFigure>, 'expressChangeMode'>;

export const MainSummaryView: FC<FigureProps> = ({
  representatives,
  partiesOrGroups,
  groupBy,
  ...menuProps
}) => {
  return <main className="flex grow items-stretch md:h-full flex-col justify-start gap-2 min-h-0">
    <ParlichartBanner />
    <div
      className="flex flex-col gap-2 md:flex-row min-h-0 md:grow"
    >
      <div className="grow">
        <ParliamentSection className="h-full w-full max-md:min-h-100">
          <ParliamentFigure
            partiesOrGroups={partiesOrGroups}
            representatives={representatives}
            groupBy={groupBy}
            {...menuProps}
            hideMenu
          />
        </ParliamentSection>
      </div>
      <div className="flex flex-col gap-2 md:max-w-71.5 justify-stretch md:overflow-y-auto">
        <SocialsSection className="grow" />
        <AboutSection className="grow" />
        <AttributionSection className="grow" />
      </div>
    </div>
  </main>;
};
