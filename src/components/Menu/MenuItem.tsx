import { FC } from "react";

type MenuItemProps = ({
  /** Unicode codepoint for icon in google material symbols */
  icon: string,
  children: React.ReactNode
});


export const MenuItem: FC<MenuItemProps> = ({ icon, children }) => (
  <li
    className={`[&::before]:font-[Material_Symbols_Outlined] [&::before]:mr-1 [&::before]:content-['${icon}']`}
  >
    {children}
  </li>
)


