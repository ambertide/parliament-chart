import { Party } from "./Party";
import { Representative } from "./Representative";

export type Snapshot = {
  // Add an aditional layer for sort method
  // this changes the arch diag so it is necessary
  // to include it.
  deputies : {
    chartData: Representative[]
    sortedParties: Party[],
  },
  alliance: {
    chartData: Representative[]
    sortedParties: Party[],
  }
};

export type ChartData = {
  [term: string]: {
    [milestoneName: string]: {
      snapshot: Snapshot
      date: string,
      slug: string
    }
  }
};
