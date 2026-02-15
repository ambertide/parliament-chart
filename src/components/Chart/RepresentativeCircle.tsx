import { Representative } from "@/types"
import { FC } from "react";

export const RepresentativeCircle: FC<Representative> = ({
  location: {
    x,
    y
  },
  party: {
    partyColor
  },
}) =>  (
  <circle
    cx={x}
    cy={y}
    r={5}
    fill={partyColor}
  />
);
