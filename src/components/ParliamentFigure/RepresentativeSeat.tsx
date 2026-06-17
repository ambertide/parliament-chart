import { Representative } from "@/types";
import { FC, useMemo } from "react";
import { useSVGAnimationTimeline } from "./useSVGAnimationTimeline";

const ANIMATION_DURATION = 500;

export const RepresentativeSeat: FC<{representative: Representative, diagramMode: 'map' | 'chart', selectedAlliance: string, selectedParty: string}> = ({
  representative,
  diagramMode,
  selectedAlliance,
  selectedParty
}) => {
  const {
    svgProps,
    animateProps
  } = useSVGAnimationTimeline({
    representative,
    diagramMode 
  });
  const shouldBlurRepSeat = useMemo(() => {
    // Blur only if a alliance or party is selected and it is NOT the
    // rep's.
    if (selectedAlliance && representative.party.allianceName !== selectedAlliance) {
      return true;
    }

    if (selectedParty && representative.party.partyName !== selectedParty) {
      return true;
    }

    return false;
  }, [
    selectedAlliance,
    selectedParty,
    representative.party.allianceName,
    representative.party.partyName
  ]);
  return (
    <circle
      fill={representative.party.partyColor}
      opacity={shouldBlurRepSeat ? 0.25 : 1.0}
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

