import { Representative } from "@parlichart/types";
import { FC, useMemo } from "react";
import { useSVGAnimationTimeline } from "./useSVGAnimationTimeline";

type RepresentativeSeatProps = {
  representative: Representative,
  diagramMode: 'map' | 'chart',
  selectedAlliance: string,
  selectedParty: string,
  onRepresentativeClick: (representative: Representative) => void
};

export const RepresentativeSeat: FC<RepresentativeSeatProps> = ({
  representative,
  diagramMode,
  selectedAlliance,
  selectedParty,
  onRepresentativeClick
}) => {
  const {
    svgProps
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
      className="cursor-pointer origin-top-left"
      data-id={representative.id}
      fill={representative.party.partyColor}
      onClick={() => onRepresentativeClick(representative)}
      opacity={shouldBlurRepSeat ? 0.25 : 1.0}
      {...svgProps}
    />
  );    
};

