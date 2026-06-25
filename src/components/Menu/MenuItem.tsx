import { FC } from "react";

type MenuItemProps = ({
  /** Unicode codepoint for icon in google material symbols */
  icon: string,
  children: React.ReactNode
});


export const MenuItem: FC<MenuItemProps> = ({ icon, children }) => (
  <li
    data-before={`${icon}`}
    className={`
      before:h-full before:align-bottom before:inline-block before:font-[Material_Symbols_Outlined] before:mr-1 before:content-[attr(data-before)]
    `}
  >
    {children}
  </li>
)


