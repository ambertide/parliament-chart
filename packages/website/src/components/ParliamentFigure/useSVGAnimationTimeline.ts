import { Representative } from "@parlichart/types";
import {  Reducer, useReducer, useRef, useLayoutEffect } from "react";

/**
 * Given a representative, return the SVG props for that
 * representatives seat dot in that parliamentary chart state.
 */
const derieveSVGProps = (repr: Representative, state: 'chart' | 'map') => state === 'chart' ? ({
  cx: repr.location.x,
  cy: repr.location.y,
  r: 3.5
}) : ({
  cx: repr.mapLocation.x,
  cy: repr.mapLocation.y,
  r: 2.5
});

type SeatState = {
  sourceState: 'chart' | 'map'
  internalState: 'chart' | 'map' | 'transitioning',
  svgProps: { cx: number, cy: number, r: number},
  destinationState: 'chart' | 'map',
  representative: Representative,
  animationDirection: 'forwards' | 'backwards' | 'pause'
};

type SeatAction = {
  type: 'SWITCH_DESTINATION_STATE/CHART' | 'SWITCH_DESTINATION_STATE/MAP' | 'SETTLE_STATE' | 'START_TRANSITIONING'
};

const reducer: Reducer<SeatState, SeatAction> = (state, { type }) => {
  switch (type) {
    case 'SETTLE_STATE': {
      return {
        ...state,
        sourceState: state.destinationState,
        internalState: state.destinationState,
        svgProps: derieveSVGProps(state.representative, state.destinationState),
        animationDirection: 'pause'
      };
    }
    case 'START_TRANSITIONING': {
      return {
        ...state,
        internalState: 'transitioning',
        animationDirection: state.destinationState === state.internalState ? 'backwards' : 'forwards'
      };
    }
    case 'SWITCH_DESTINATION_STATE/CHART': {
      return {
        ...state,
        destinationState: 'chart',
        animationDirection: state.sourceState === 'chart' ? 'backwards' : 'forwards'
      };
    }
    case 'SWITCH_DESTINATION_STATE/MAP': {
      return {
        ...state,
        destinationState: 'map',
        animationDirection: state.sourceState === 'map' ? 'backwards' : 'forwards'
      };
    }
  }
};

const getKeyframes = (svgRef: SVGCircleElement, representative: Representative, diagramMode: 'chart' | 'map'): Keyframe[] => {
  const { cx: fromX, cy: fromY, r: fromR} = derieveSVGProps(representative, diagramMode);
  const { cx: toX, cy: toY, r: toR } = derieveSVGProps(representative, diagramMode === 'chart' ? 'map' : 'chart');
  const deltaScale = 1;
  const deltaX = (toX - fromX) / deltaScale;
  const deltaY = (toY - fromY) / deltaScale;
  return [ { transform: `translateX(0) translateY(0)` }, { transform: `translateX(${deltaX}px) translateY(${deltaY}px)` }];
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
  const svgRef = useRef<SVGCircleElement>(null);
  /**
   * Internal state of the seat, which is different as animation takes time.
   * we use this to track how to stop, resume, pause etc. the animation.
   */
  const [
    {
      animationDirection,
      internalState,
      destinationState,
      svgProps,
      sourceState
    },
    dispatch
  ] = useReducer(
    reducer, {
      representative,
      destinationState: diagramMode,
      internalState: diagramMode,
      svgProps: derieveSVGProps(representative, diagramMode),
      animationDirection: 'pause',
      sourceState: diagramMode
    });

  useLayoutEffect(() => {
    if (animationDirection !== 'pause' && internalState !== 'transitioning') {
      // Start transitioning if signal has arrived.
      dispatch({ type: 'START_TRANSITIONING' });
    }
    
    if (destinationState !== diagramMode) {
      // If diagram mode changed, signal switch
      dispatch({ type: diagramMode === 'chart' ? 'SWITCH_DESTINATION_STATE/CHART' : 'SWITCH_DESTINATION_STATE/MAP'});
    }

    if (internalState === 'transitioning') {
      const svgElement = svgRef.current;
      if (svgElement) {
        if (svgElement.getAnimations().length === 0) {
          // no animations started when we are transitioning???
          // blasphemy, lets add an animation.
          const animationJustDeclared = svgElement.animate(getKeyframes(svgElement, representative, sourceState), { duration: 500, fill: 'forwards' });
          animationJustDeclared.addEventListener('finish', () => {
            dispatch({ type: 'SETTLE_STATE'});
            setTimeout(() => animationJustDeclared.cancel());
          } , { once: true });
          animationJustDeclared.play();
        }
        const animation = svgElement.getAnimations()[0];
        if (animationDirection === 'forwards' && animation.playbackRate < 0) {
          animation.reverse();
        } else if (animationDirection === 'backwards' && animation.playbackRate > 0) {
          animation.reverse();
        }
      }
    }
  }, [animationDirection, destinationState, diagramMode, internalState, representative, sourceState]);

  return {
    svgProps: {
      ...svgProps,
      ref: svgRef
    }
  };
};
