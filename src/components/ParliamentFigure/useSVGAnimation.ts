import { Representative } from "@/types";

export const useSVGAnimation = (representative: Representative, diagramMode: 'map' | 'chart') => {
  const { x: xFrom, y: yFrom } = diagramMode === 'map' ? representative.mapLocation : representative.location;
  const { x: xTo, y: yTo } = diagramMode === 'chart' ? representative.mapLocation : representative.location;
  const rFrom = diagramMode === 'chart' ? 3.5 : 2.5;
  const rTo = diagramMode === 'chart' ? 2.5 : 3.5;
  return {
    cx: {
      from: xFrom,
      to: xTo
    },
    cy: {
      from: yFrom,
      to: yTo
    },
    r: {
      from: rFrom,
      to: rTo
    }
  };
};

