import { FC, JSX } from "react";

type DocsNavigationProps = {
  links: {
    title: string,
    link: string
  }[],
  className?: JSX.IntrinsicElements['nav']['className'],
  hidden?: boolean
};
export const DocsNavigation: FC<DocsNavigationProps> = ({
  links,
  className = '',
  hidden
}) => (
  <nav
    className={className}
    // Do not change this to display: hidden as that stops animations
    aria-hidden={hidden}
  >
    <ul
      // And do not change this to aria-hidden because this part isnt animated
      // however this is still necessary as aria-hidden does not recursively descend.
      // Also, yes I know display transitions arent widely adopted yet.
      className={`duration-300 transition-[display] ${hidden ? 'hidden' : ''}`}
    >
      {links.map(({ link, title }) => <li
        className="text-sm text-foreground font-serif-degraded"
        key={link}
      >
        <a href={link}>
          {title}
        </a>
      </li>)}
    </ul>
  </nav>
);
