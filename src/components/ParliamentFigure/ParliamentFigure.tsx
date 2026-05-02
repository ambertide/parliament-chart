import { ComponentProps, ElementType, FC, useMemo, useState } from "react";
import { Mode, ModeSwitch } from "../ModeSwitch";
import { ParliamentChart, ParliamentChartProps } from "../ParliamentChart";
import { PartyLegend } from "../PartyLegend";

const diagramModeRenderMap: Record<Mode, ElementType<ParliamentChartProps>> = {
  'chart': ParliamentChart,
  'map': ParliamentChart
};

type ParliamentFigureProps = ComponentProps<typeof ParliamentChart> & 
  ComponentProps<typeof PartyLegend>
;


export const ParliamentFigure: FC<ParliamentFigureProps> = ({
  representatives,
  // DO NOT try to grab the legend props seperately
  // ts compoiler cannot figure out that the remaining
  // props are tied to each other through the tagged union
  // declaration I gave under party legend, and WILL error out.
  ...legendProps
}) => {
  const [diagramMode, setDiagramMode] = useState<Mode>('chart');
  const RenderElement = useMemo(() => diagramModeRenderMap[diagramMode], [diagramMode]);
  return <section>
    <ModeSwitch
      setMode={setDiagramMode}
      selectedMode={diagramMode}
    />
    <figure
      className="max-w-200 max-h-110 w-full flex flex-col"
    >
      <RenderElement representatives={representatives}/>
      <figcaption>
        <PartyLegend {...legendProps} />
      </figcaption>
    </figure>
  </section>;
};