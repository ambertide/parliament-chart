import { FC } from "react";
import { CombinedSelect } from "./CombinedSelect"

type MenuProps = {
  selectedTerm: number,
  onTermSelect: (newTerm: number) => void
};

export const Menu: FC<MenuProps> = ({ selectedTerm, onTermSelect }) => (
  <menu>
    <CombinedSelect
      terms={[20, 21, 22, 23, 24, 25, 26, 27].map((term) => (
        {
          term,
          governmentsUnderTerm: []
        }
      ))}
      selectedGovernment=""
      selectedTerm={selectedTerm}
      onTermSelect={onTermSelect}
      showGovernments={false}
    />
  </menu>
)