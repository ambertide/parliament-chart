import { ComponentProps, ElementType, FC, useMemo, useState } from "react";
import { Mode, ModeSwitch } from "../ModeSwitch";
import { PartyLegend } from "../PartyLegend";
import { BlankMapSVG } from "@/assets/images/BlankMapSVG";
import { useDiagramMode } from "./useDiagramMode";
import { Representative } from "@/types";

type ParliamentFigureProps = { representatives: Representative[] }& 
  ComponentProps<typeof PartyLegend>
;

const ANIMATION_DURATION = 500;


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
            {
              mapLocation: {
                x: xTo,
                y: yTo
              },
              location: {
                x: xFrom,
                y: yFrom
              },
              party: {
                partyColor
              }
            },
            index
          ) =>
            <circle
              key={index}
              fill={partyColor}
              cx={xFrom}
              cy={yFrom}
              r={3.5}
            >
              <animate
                className="to-map-animation"
                attributeName="r"
                dur={`${ANIMATION_DURATION}ms`}
                from={3.5}
                to={2.5}
                repeatCount="once"
                fill="freeze"
                begin="indefinite"
              />
              <animate
                className="to-chart-animation"
                attributeName="r"
                dur={`${ANIMATION_DURATION}ms`}
                to={3.5}
                from={2.5}
                repeatCount="once"
                fill="freeze"
                begin="indefinite"
              />
              <animate
                className="to-map-animation"
                attributeName="cx"
                from={xFrom}
                to={xTo}
                dur={`${ANIMATION_DURATION}ms`}
                repeatCount="once"
                fill="freeze"
                begin="indefinite"
              />
              <animate
                className="to-chart-animation"
                attributeName="cx"
                from={xTo}
                to={xFrom}
                dur={`${ANIMATION_DURATION}ms`}
                repeatCount="once"
                fill="freeze"
                begin="indefinite"
              />
              <animate
                className="to-map-animation"
                attributeName="cy"
                from={yFrom}
                to={yTo}
                dur={`${ANIMATION_DURATION}ms`}
                repeatCount="once"
                fill="freeze"
                begin="indefinite"
              />
              <animate
                className="to-chart-animation"
                attributeName="cy"
                from={yTo}
                to={yFrom}
                dur={`${ANIMATION_DURATION}ms`}
                repeatCount="once"
                fill="freeze"
                begin="indefinite"
              />
            </circle>
          )}
        </svg>
      </div>
      <figcaption>
        <PartyLegend {...legendProps} />
      </figcaption>
    </figure>
  </section>;
};