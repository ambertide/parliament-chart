import { ComponentProps, ElementType, FC, useMemo, useState } from "react";
import { Mode, ModeSwitch } from "../ModeSwitch";
import { PartyLegend } from "../PartyLegend";
import { BlankMapSVG } from "@/assets/images/BlankMapSVG";
import { useDiagramMode } from "./useDiagramMode";
import { Representative } from "@/types";
import { RepresentativeSeat } from "./RepresentativeSeat";

type ParliamentFigureProps = { representatives: Representative[] }& 
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
  const {svgRootRef, onDiagramToggleClick, diagramMode} = useDiagramMode(); 
  return <section
    className="flex flex-col items-center"
  >
    <ModeSwitch
      setMode={onDiagramToggleClick}
      selectedMode={diagramMode}
    />
    <figure
      className="sm:w-160 w-80 flex flex-col gap-5"
    >
      <div
        className="h-46 sm:h-96 box-border flex flex-col items-center justify-center"
      >
        <svg
          id="root"
          viewBox="0 0 552 323"
          className="grow w-full"
          ref={svgRootRef}
        >
          <BlankMapSVG isVisible={diagramMode === "map"} />
          {representatives.map((
            representative
          ) =>
            <RepresentativeSeat
              // This is required the force the rerender when the groupBy attribute changes
              // as well, do not set this to index or sth :)
              key={representative.id}
              representative={representative}
              diagramMode={diagramMode}
            />
          )}
        </svg>
      </div>
      <figcaption>
        <PartyLegend {...legendProps} />
      </figcaption>
    </figure>
  </section>;
};