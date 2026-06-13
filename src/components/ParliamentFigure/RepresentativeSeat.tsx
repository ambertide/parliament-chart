import { Representative } from "@/types";
import { FC } from "react";
import { useSVGAnimationTimeline } from "./useSVGAnimationTimeline";

const ANIMATION_DURATION = 500;


export const RepresentativeSeat: FC<{representative: Representative, diagramMode: 'map' | 'chart'}> = ({
  representative,
  diagramMode
}) => {
  const {
    svgProps,
    animateProps
  } = useSVGAnimationTimeline({
    representative,
    diagramMode 
  });
  return (
    <circle
      fill={representative.party.partyColor}
      {...svgProps}
    >
      {
      // Then add animations for each attributes from -> to pair.
      // First convert to prop objects and then into the
      // animate tags
        Object.entries(animateProps)
          .map(([attributeName, { from, to }]) => ({ attributeName, from, to}))
          .map( animProps => <animate
            key={`repr-${animProps.attributeName}-animation`}
            className="chart-transition-animation"
            dur={`${ANIMATION_DURATION}ms`}
            repeatCount="once"
            fill="freeze"
            begin="indefinite"
            {...animProps}
          />)
      }
    </circle>
  );    
};

