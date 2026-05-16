import { ComponentProps, ElementType, FC, useMemo, useState } from "react";
import { Mode, ModeSwitch } from "../ModeSwitch";
import { ParliamentChart, ParliamentChartProps } from "../ParliamentChart";
import { PartyLegend } from "../PartyLegend";
import { ParliamentMap } from "../ParliamentMap";

const diagramModeRenderMap: Record<Mode, ElementType<ParliamentChartProps>> = {
  'chart': ParliamentChart,
  'map': ParliamentMap
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
  return <section
    className="flex flex-col items-center"
  >
    <ModeSwitch
      setMode={setDiagramMode}
      selectedMode={diagramMode}
    />
    <figure
      className="sm:w-160 w-80 max-h-113 flex flex-col"
    >
      <RenderElement representatives={representatives}/>
      <figcaption>
        <PartyLegend {...legendProps} />
      </figcaption>
    </figure>
  </section>;
};