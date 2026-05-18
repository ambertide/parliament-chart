import { ParliamentFigure } from "@/components";
import { sortParties, calculateSeatCoords } from "@/hooks";
import { IndividualRepresentative, Party } from "@/types";
import { FC } from "react";

type FigureProps = {
  parties: Party[],
  groupBy: 'deputies' | 'groups' | 'alliance',
  numberOfRepresentatives: number,
  individualRepresentatives: IndividualRepresentative[]
};

export const Figure: FC<FigureProps> = ({
  parties,
  groupBy,
  numberOfRepresentatives,
  individualRepresentatives
}) => {
  const {
    representatives,
    sortedParties: _
  } = calculateSeatCoords({
    parties,
    groupBy,
    numberOfRepresentatives,
    individualRepresentatives
  });

  const partiesOrGroups = sortParties({ parties, groupBy, flatten: false as true}); // < Makes sense in the context.
  return <ParliamentFigure
    partiesOrGroups={partiesOrGroups}
    representatives={representatives}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupBy={groupBy as any}
  />;
};