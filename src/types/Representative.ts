import { Party } from "./Party";

export type Representative = {
  party: Party,
  location: {
    x: number,
    y: number
  },
  counterClockwise: string,
  clockwise: string
};
