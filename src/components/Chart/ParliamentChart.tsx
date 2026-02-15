import { useCalculateDiagramCircles } from "@/hooks";
import { Party, Representative } from "@/types"
import { FC } from "react";
import { RepresentativeCircle } from "./RepresentativeCircle";

type ParliamentChartProps = {
  representatives: Representative[]
};

export const ParliamentChart: FC<ParliamentChartProps> = ({
  representatives
}) => (
  <svg
    id="root"
    viewBox="0 0 800 400"
    xmlns="http://www.w3.org/2000/svg"
    className="grow w-full"
  >
    {representatives.map((rep, i) => <RepresentativeCircle key={i} {...rep} />)}
  </svg>
)