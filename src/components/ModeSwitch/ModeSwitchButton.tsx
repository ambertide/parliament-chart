import { FC } from "react";
import ChartIcon from "../../assets/images/chartIcon.png";
import MapIcon from "../../assets/images/mapIcon.png";
import Image from "next/image";

const iconMap = {
  map: MapIcon,
  chart: ChartIcon
};

export type ModeSwitchButtonProps = {
  type: 'chart' | 'map',
  onClick: () => void,
  pressed: boolean
};
export const ModeSwitchButton: FC<ModeSwitchButtonProps> = ({
  pressed,
  type,
  onClick
}) => <div

  className="z-20"
>
  <input
    className="unset hidden"
    type="radio"
    checked={pressed}
    value={type}
    onChange={() => {
      onClick();
    }}
    id={`${type}-mode-switch`}
  />
  <label
    htmlFor={`${type}-mode-switch`}
    className="p-2 block rounded-4xl cursor-pointer"
  >
    <Image
      src={iconMap[type]}
      alt={type}
      className="h-4"
      height="16"
      loading="eager"
    />
  </label>
</div>;
