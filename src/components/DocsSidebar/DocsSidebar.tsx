import { FC } from "react";

type DocsSidebarProps = {
  links: {
    title: string,
    link: string
  }[]
};
export const DocsSidebar: FC<DocsSidebarProps> = ({ links }) => (
  <nav>
    <ul>
      {links.map(({ link, title }) => <li
        className="text-sm text-foreground"
        key={link}
      >
        <a href={link}>
          {title}
        </a>
      </li>)}
    </ul>
  </nav>
);