import { Ref, useCallback, useRef, useState } from "react";

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
  const svgRootRef = useRef<SVGSVGElement>(null);
  const onDiagramToggleClick = useCallback((newDiagramMode: 'chart' | 'map') => {
    svgRootRef.current?.querySelectorAll('animate.chart-transition-animation').forEach((animation) => {
      (animation as SVGAnimateElement).beginElement();
    });
    setDiagramMode(newDiagramMode);
  }, [setDiagramMode]);
  return {
    svgRootRef,
    diagramMode,
    onDiagramToggleClick
  };
};
