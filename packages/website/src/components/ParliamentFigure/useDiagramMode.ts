import { Ref, useCallback, useEffect, useRef, useState } from "react";

type UseDiagramMode = () => {
  svgRootRef: Ref<SVGSVGElement>,
  diagramMode: 'chart' | 'map',
  onDiagramToggleClick: (newDigramMode: 'chart' | 'map') => void
};

/**
 * Control the diagram mode by triggering seat animations and
 * makine sure every seat is in the right place.
 */
export const useDiagramMode: UseDiagramMode = () => {
  const [diagramMode, setDiagramMode] = useState<'chart' | 'map'>('chart');
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const svgRootRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const maybeAnimation: SVGAnimateElement | undefined | null = svgRootRef.current?.querySelector('animate.chart-transition-animation');
    const endEvent = () => console.log('holly shit') || setIsAnimationRunning(false);
    if (maybeAnimation) {
      maybeAnimation.addEventListener('endEvent', endEvent);
    }
    return () => {
      if (maybeAnimation) {
        maybeAnimation.removeEventListener('endEvent', endEvent);
      }
    };
  }, []);
  const onDiagramToggleClick = useCallback(async (newDiagramMode: 'chart' | 'map') => {
    const currSvg = svgRootRef.current;
    if (isAnimationRunning && currSvg) {
      // When this happens we need to _finalize_ the animation, ie, immediately finish it.
      // and wait for all those animations to finish before triggering the next animation,
  
      // First add a tracker to all running animations so that we can track them.
      const trackingPromises: Promise<boolean>[] = currSvg.querySelectorAll('animate.chart-transition-animation').values().toArray().map((animation) => {
        const trackingPromise = new Promise<boolean>(resolve => {
          animation.addEventListener('endEvent', () => resolve(true), { once: true });
        });
        return trackingPromise;
      });

      // Next force all of them to terminate.
      const svgTime = currSvg.getCurrentTime();
      currSvg.setCurrentTime(svgTime + 60);

      // Finally wait for termination before continuing as usual.
      await Promise.all(trackingPromises);
    }
    // Otherwise, or afterwards, mark the animation run as starting.
    setIsAnimationRunning(true);
    svgRootRef.current?.querySelectorAll('animate.chart-transition-animation').forEach((animation) => {
      (animation as SVGAnimateElement).beginElement();
    });
    setDiagramMode(newDiagramMode);
  }, [setDiagramMode, isAnimationRunning]);
  return {
    svgRootRef,
    diagramMode,
    onDiagramToggleClick
  };
};
