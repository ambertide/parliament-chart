import { Representative } from "@/types";
import { FC } from "react";
import { RepresentativeCircle } from "./RepresentativeCircle";

export type ParliamentChartProps = {
  representatives: Representative[]
};

export const ParliamentChart: FC<ParliamentChartProps> = ({
  representatives
}) => (
  <svg
    id="root"
    viewBox="0 0 800 400"
    className="grow w-full"
  >
    {representatives.map((rep, i) => <RepresentativeCircle key={i} {...rep} />)}
  </svg>
);