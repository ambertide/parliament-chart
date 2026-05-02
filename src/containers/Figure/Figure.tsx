import { ParliamentFigure } from "@/components";
import { useCalculateDiagramCircles, useSortedParties } from "@/hooks";
import { Party } from "@/types";
import { FC } from "react";

type FigureProps = {
  parties: Party[],
  groupBy: 'deputies' | 'groups' | 'alliance',
  numberOfRepresentatives: number
};

export const Figure: FC<FigureProps> = ({
  parties,
  groupBy,
  numberOfRepresentatives
}) => {
  const {
    representatives,
    sortedParties: _
  } = useCalculateDiagramCircles({
    parties,
    groupBy,
    numberOfRepresentatives
  });

  const partiesOrGroups = useSortedParties({ parties, groupBy, flatten: false as true}); // < Makes sense in the context.
  console.log(parties);
  console.log(representatives);
  return <ParliamentFigure
    partiesOrGroups={partiesOrGroups}
    representatives={representatives}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupBy={groupBy as any}
  />;
};