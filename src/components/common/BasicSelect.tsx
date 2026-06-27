import { FC, JSX } from "react";

export type Option = {
  value: string | number,
  displayValue: string
};


type BasicSelectProps = {
  options: Option[],
  selectedValue: string | number,
  id: string,
  onChange: (newValue: string | number) => void,
  className?: JSX.IntrinsicElements['select']['className']
};

export const BasicSelect: FC<BasicSelectProps> = ({
  options,
  selectedValue,
  id,
  className = '',
  onChange
}) => (
  <select
    id={id}
    value={selectedValue}
    className={"field-sizing-content text-emphasis italic appearance-none" + ` ${className}`}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map(({ value, displayValue }) => (
      <option
        value={value}
        key={value}
      >
        {displayValue}
      </option>
    ))}
  </select>
);
