import { FC, useMemo, useState } from "react";
import { ModeSwitchButton, ModeSwitchButtonProps } from "./ModeSwitchButton";

type ModeSwitchProps = {
  selectedMode: ModeSwitchButtonProps['type'],
  setMode: (newMode: ModeSwitchButtonProps['type']) => void
};

const modes: ModeSwitchButtonProps['type'][] = [
  'map',
  'chart'
];

export const ModeSwitch: FC<ModeSwitchProps> = ({
  selectedMode,
  setMode
}) => {
  return (<fieldset
    className="bg-background-secondary w-fit flex rounded-4xl p-0.5 before:content-[' '] before:block before:w-13.25 before:absolute relative before:rounded-4xl before:left-0.5 before:top-0.5 before:z-10 before:h-8 before:bg-emphasis [&:has(#chart-mode-switch:checked)]:before:translate-x-13.25 before:transition:transform before:duration-200"
  >
    {modes.map(
      mode => <ModeSwitchButton
        key={mode}  
        type={mode}
        pressed={selectedMode === mode}
        onClick={() => setMode(mode)}
      />
    )}
  </fieldset>
  );

};