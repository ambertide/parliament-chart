import { Representative } from "@/types";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";

/**
 * Calculate the props for the animate tag going into this representative's
 * seat circle.
 * @param representative Representative object
 * @param diagramMode Which mode the diagram is currently.
 * @returns The prop values for the svg.
 */
const calculateSVGAnimateTagProps = (representative: Representative, diagramMode: 'map' | 'chart') => {
  const { x: xFrom, y: yFrom } = (diagramMode === 'map' ? representative.mapLocation : representative.location) ?? {x: 0, y: 0};
  const { x: xTo, y: yTo } = (diagramMode === 'chart' ? representative.mapLocation : representative.location) ?? {x: 0, y: 0};
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


const derieveSVGProps = (animateProps: ReturnType<typeof calculateSVGAnimateTagProps>): ComponentProps<'circle'> => {
  return Object.fromEntries(Object.entries(animateProps).map(([ attributeName, { from, to: _discardForInititalState }]) => ([ attributeName, from ])));
};

/**
 * Control the way the svg animation timeline affects an individual seat's coords.
 * @returns 
 */
export const useSVGAnimationTimeline = ({
  representative,
  diagramMode,
}: {
  representative: Representative,
  diagramMode: 'map' | 'chart',
}) => {
  /** Internal state of the seat, which is different as animation takes time. */
  const [seatState, setSeatState] = useState(diagramMode);
  const animateProps = useMemo(() => calculateSVGAnimateTagProps(representative, seatState), [seatState, representative]);
  const svgRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const animate = svgRef.current?.querySelector('animate');
    const listener =  () => {
      setSeatState(previous => previous === 'chart' ? 'map' : 'chart');
    };
    animate?.addEventListener('endEvent', listener);
    return () => {
      animate?.removeEventListener('endEvent', listener);
    };
  }, [setSeatState]);
  const svgProps: ComponentProps<'circle'> = useMemo(() => derieveSVGProps(animateProps), [animateProps]);
  return {
    animateProps,
    svgProps: {
      ...svgProps,
      ref: svgRef
    }
  };
};
