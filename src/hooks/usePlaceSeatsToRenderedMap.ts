import { useCallback, useLayoutEffect, useState } from "react";
import electoralDistricts from '../assets/electoral_districts.json';

/**
 * Put a rough category on a province shape, according to which
 * we can render the dots in a specific way.
 * @param provinceBBox Province box
 * @returns 
 */
const categorizeProvince = (provinceBBox: DOMRect): 'vertical' | 'horizontal' => {
  if (provinceBBox.width > provinceBBox.width) {
    return 'vertical';
  }
  return 'horizontal';
};

type Position = { Cx: number, Cy: number };

const offsetsByPointCount = [
  [],
  [[0, 0]],
  [[+3, 0], [-3, 0]],
  [[-3 * Math.tan(Math.PI/6), -3], [-3 * Math.tan(Math.PI/6), 3], [3/Math.cos(Math.PI/6), 0]],
  [[-3, 3], [3, 3], [3, -3], [-3 , -3]],
  [],
  [[6, 0], [0, -3], [0, 3], [-6 , -6], [-6, 6], [-6, 0]]
];

const calculateSeatLocations: (
  /** Where to place the seats around */
  centre: { Cx: number, Cy: number},
  /** How to place the seats */
  oriantation: 'vertical' | 'horizontal',
  /** Number of seats to emplace */
  seatNumber: number
) => Position[] = (
  {
    Cx: centreX,
    Cy: centreY
  },
  oriantation,
  seatNumber
) => {
  const offsets = offsetsByPointCount[seatNumber];
  // We try to generalize the algorithm here
  // by using css-esque cross/inline semantics.
  const [inlineAxis, crossAxis] = oriantation === 'vertical' ? ['Cy' as const, 'Cx' as const] : ['Cx' as const, 'Cy' as const];
  const [Cinline, Ccross] = oriantation === 'vertical' ? [centreY, centreX] : [centreX, centreY];
  return offsets.map(([dCross, dInline]) => ({
    [inlineAxis]:  Cinline + dInline,
    [crossAxis]: Ccross + dCross
  }) as Position);
};

const newSeat = ({Cx, Cy}: Position): SVGCircleElement => {
  const seat = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  seat.setAttribute('r', "2.5");
  seat.setAttribute('cx', `${Cx}`);
  seat.setAttribute('cy', `${Cy}`);
  return seat;
}; 

/**
 * Place the seats to the rendered map, do not return
 * mutates the dom instead.
 */
const placeSeatsToRenderedMap = () => {
  // Paths that are already gs have been predefined, eg: istanbul and izmir areas
  const undefinedProvinces = document.querySelectorAll('.parliament-map g#layer16 > g#map_proper > path');
  debugger;
  const newProvinces = undefinedProvinces.values().toArray()
    .filter(maybeProvince => maybeProvince.id in electoralDistricts)
    .filter(province => electoralDistricts[province.id as keyof typeof electoralDistricts] <= 6)
    .map(provinceSVGPath => {
      // Calculate where to offset the children
      const provinceGeometricBBox = (provinceSVGPath as SVGGraphicsElement).getBBox();
      const Cx = provinceGeometricBBox.x + provinceGeometricBBox.width/2;
      const Cy = provinceGeometricBBox.y + provinceGeometricBBox.height/2;
      const g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute('x', `${provinceGeometricBBox.x}`);
      g.setAttribute('y', `${provinceGeometricBBox.y}`);
      const provinceShapeCategory = categorizeProvince(provinceGeometricBBox);
      // Get the child locations
      const locations = calculateSeatLocations({ Cx, Cy }, provinceShapeCategory, electoralDistricts[provinceSVGPath.id as keyof typeof electoralDistricts]);
      // Add the seats to the g
      g.appendChild(provinceSVGPath);
      g.append(...locations.map(newSeat));
      g.id = `${provinceSVGPath.id}_seats`;
      return g;
    });
  document.querySelector('g#map_proper')?.append(...newProvinces); 
};



export const usePlaceSeatsToRenderedMap = (onComplete: () => void) => {
  useLayoutEffect(() => {
    placeSeatsToRenderedMap();
    onComplete();
  }, [
    onComplete
  ]);
};