import { ComponentProps, FC } from "react";
import { ModeSwitch } from "../ModeSwitch";
import { PartyLegend } from "../PartyLegend";
import { BlankMapSVG } from "@/assets/images/BlankMapSVG";
import { useDiagramMode } from "./useDiagramMode";
import { Party, Representative } from "@/types";
import { RepresentativeSeat } from "./RepresentativeSeat";
import { usePartyOrGroupSelect } from "./usePartyOrGroupSelect";

type ParliamentFigureProps = { representatives: Representative[] }& 
  Omit<ComponentProps<typeof PartyLegend>, 'onPartyOrGroupSelect' | 'selectedParty' | 'selectedAlliance'>
;

export const ParliamentFigure: FC<ParliamentFigureProps> = ({
  representatives,
  groupBy,
  partiesOrGroups,
  ...menuProps
}) => {
  const {svgRootRef, onDiagramToggleClick, diagramMode} = useDiagramMode();
  const { onPartyOrGroupSelect, rootProps, selectedAlliance, selectedParty } = usePartyOrGroupSelect(); 
  return <section
    className="flex flex-col items-center w-full h-full grow"
    {...rootProps}
  >
    <ModeSwitch
      setMode={onDiagramToggleClick}
      selectedMode={diagramMode}
    />
    <figure
      className="grow grid min-w-0 min-h-0 items-center justify-center p-1 sm:p-2 md:p-4 lg:p-8 max-w-full max-h-full"
    >
      <svg
        className="w-auto h-full max-w-full max-h-full"
        id="root"
        viewBox="0 0 552 323"
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
            selectedAlliance={selectedAlliance}
            selectedParty={selectedParty}
            onRepresentativeClick={({ party: { partyName }}) => onPartyOrGroupSelect('party', partyName)}
          />
        )}
      </svg>
      <PartyLegend
        onPartyOrGroupSelect={onPartyOrGroupSelect}
        // Below casts aren't real, they're to fool the ts compiler as there is a bug
        // that causes the groupBy/partiesOrGroups link.
        groupBy={groupBy as 'deputies'}
        partiesOrGroups={partiesOrGroups as Party[]}
        selectedAlliance={selectedAlliance}
        selectedParty={selectedParty}
        {...menuProps}
      />
    </figure>
  </section>;
};
