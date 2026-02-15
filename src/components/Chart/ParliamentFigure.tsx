import { useCalculateDiagramCircles, useSortedParties } from "@/hooks";
import { ParliamentChart } from "./ParliamentChart"
import { PartyLegend } from "./PartyLegend"
import { Party } from "@/types";
import { FC } from "react";

type ParliamentFigureProps = {
  parties: Party[],
  groupBy: 'deputies' | 'alliance' | 'groups'
};

export const ParliamentFigure: FC<ParliamentFigureProps> = ({
  parties,
  groupBy
}) => {
  const {
    representatives,
    sortedParties
  } = useCalculateDiagramCircles({
    parties,
    groupBy
  });

  const partiesOrGroups = useSortedParties({ parties, groupBy, flatten: false as true}); // <-- Makes sense in the context. 
  
  return <figure
    className="max-w-200 max-h-100 w-full"
  >
    <ParliamentChart representatives={representatives}/>
    <figcaption>
      <PartyLegend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        groupBy={groupBy as any}
        partiesOrGroups={partiesOrGroups}
      />
    </figcaption>
  </figure>
}