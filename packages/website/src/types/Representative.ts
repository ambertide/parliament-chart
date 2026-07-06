import { Party } from "./Party";

export type Representative = {
  id: string,
  party: Party,
  location: {
    x: number,
    y: number
  },
  // Location this seat has on the map
  mapLocation: {
    x: number,
    y: number
  }
  counterClockwise: string,
  clockwise: string,
  province?: string
};
