import { useCalculateDiagramCircles, useSortedParties } from "@/hooks";
import { ParliamentChart } from "./ParliamentChart";
import { PartyLegend } from "./PartyLegend";
import { Party } from "@/types";
import { FC } from "react";

type ParliamentFigureProps = {
  parties: Party[],
  groupBy: 'deputies' | 'alliance' | 'groups',
  numberOfRepresentatives: number
};

export const ParliamentFigure: FC<ParliamentFigureProps> = ({
  parties,
  groupBy,
  numberOfRepresentatives
}) => {
  const {
    representatives,
    sortedParties
  } = useCalculateDiagramCircles({
    parties,
    groupBy,
    numberOfRepresentatives
  });

  const partiesOrGroups = useSortedParties({ parties, groupBy, flatten: false as true}); // <-- Makes sense in the context. 
 
  
};