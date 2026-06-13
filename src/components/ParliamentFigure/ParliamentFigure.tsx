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


const determineAnimationProps = (representative: Representative, diagramMode: 'map' | 'chart') => {
  const { x: xFrom, y: yFrom } = diagramMode === 'map' ? representative.mapLocation : representative.location;
  const { x: xTo, y: yTo } = diagramMode === 'chart' ? representative.mapLocation : representative.location;
  const rFrom = diagramMode === 'chart' ? 3.5 : 2.5;
  const rTo = diagramMode === 'chart' ? 2.5 : 3.5;
  return {
    cx: {
      from: xFrom,
      to: xTo
    },
    cy: {
      from: yFrom,
      to: yTo
    },
    r: {
      from: rFrom,
      to: rTo
    }
  };
};

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
            representative,
            index
          ) => {
            const animationValues = determineAnimationProps(representative, diagramMode);
            return (
              <circle
                key={index}
                fill={representative.party.partyColor}
                {
                  ...Object.fromEntries(Object.entries(animationValues)
                    // Set the initial values to that of the [attribute].from
                    .map(([attributeName, { from, to: _discardForDefault }]) => ([attributeName, from]))
                  )
                }
              >
                {
                  // Then add animations for each attributes from -> to pair.
                  // First convert to prop objects and then into the
                  // animate tags
                  Object.entries(animationValues)
                    .map(([attributeName, { from, to }]) => ({ attributeName, from, to}))
                    .map( animProps => <animate
                      key={`repr-${index}-${animProps.attributeName}-animation`}
                      className="to-map-animation"
                      dur={`${ANIMATION_DURATION}ms`}
                      repeatCount="once"
                      fill="freeze"
                      begin="indefinite"
                      {...animProps}
                    />)
                }
              </circle>
            );
          })}
        </svg>
      </div>
      <figcaption>
        <PartyLegend {...legendProps} />
      </figcaption>
    </figure>
  </section>;
};