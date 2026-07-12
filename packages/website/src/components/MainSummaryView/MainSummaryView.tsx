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
  return <main className="flex grow items-stretch h-full flex-col justify-start gap-2">
    <ParlichartBanner />
    <div
      className="grow flex flex-col gap-2 md:grid md:grid-cols-[1fr_286px] md:grid-flow-col"
    >
      <ParliamentSection className="grow md:row-start-1 md:row-end-4 max-h-full">
        <ParliamentFigure
          partiesOrGroups={partiesOrGroups}
          representatives={representatives}
          groupBy={groupBy}
          {...menuProps}
          hideMenu
        />
      </ParliamentSection>
      <SocialsSection />
      <AboutSection />
      <AttributionSection />
    </div>
  </main>;
};
