import { FC } from "react"

export type Option = {
  value: string | number,
  displayValue: string
}


type BasicSelectProps = {
  options: Option[],
  selectedValue: string | number,
  id: string,
  onChange: (newValue: string | number) => void
}

export const BasicSelect: FC<BasicSelectProps> = ({
  options,
  selectedValue,
  id,
  onChange
}) => (
  <select
    id={id}
    value={selectedValue}
    className="unset text-emphasis italic appearance-none"
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
)