import { Point } from "@/types";
import { useMemo } from "react";

type UseRotatedCoordinates = (p: {
  /** Angle of rotation by which the original rep. circle will be rotated */
  angleOfRotation: number,
  /** We rotate around a fixed point, originally this was a CodePen and we had a template point*/
  pointO: Point;
  /** Point around which the original point is rotated. */
  canvasPivotPointO: Point;
}) => Point

export const calculateRotatedCoordinates: UseRotatedCoordinates = ({
  angleOfRotation,
  pointO,
  canvasPivotPointO
}) => {
  // Scale everything by 1000
  const point = { x: pointO.x * 1000, y: pointO.y * 1000 };
  const canvasPivotPoint = {
    x: canvasPivotPointO.x * 1000,
    y: canvasPivotPointO.y * 1000
  };
  // Point coordinates are global, so are the
  // pivot points, in order to calculate the
  // rotation, we must convert the point to
  // local coordinates wrt the pivot.
  // Another complication is that the Y coordinate
  // is with respect to the Canvas as well, which is
  // different from cartesian coordinates.
  const localX = canvasPivotPoint.x - point.x;
  const localY = canvasPivotPoint.y - point.y;
  const cosTheta = Math.cos(angleOfRotation);
  const sinTheta = Math.sin(angleOfRotation);
  const lXPrime = localX * cosTheta - localY * sinTheta;
  const lYPrime = localX * sinTheta + localY * cosTheta;
  // This calculation gives us the local coords
  // and now we must transpose it BACK to the
  // global coordinate space.
  const globalX = canvasPivotPoint.x - lXPrime;
  const globalY = canvasPivotPoint.y - lYPrime;
  // Finally probably we should round these
  // because floating point is evil.
  const roundedX = Math.round(globalX) / 1000;
  const roundedY = Math.round(globalY) / 1000;
  return {
    x: roundedX,
    y: roundedY
  };
}

export const useRotatedCoordinates: UseRotatedCoordinates = ({
  angleOfRotation,
  pointO,
  canvasPivotPointO
}) => {
  // Scale everything by 1000
  return useMemo(
    () => calculateRotatedCoordinates({
      angleOfRotation,
      pointO,
      canvasPivotPointO
    }),
    [
      angleOfRotation,
      pointO,
      canvasPivotPointO
    ]);
}
