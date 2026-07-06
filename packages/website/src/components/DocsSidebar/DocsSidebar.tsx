import { ComponentProps, FC, useState } from "react";
import { DocsNavigation } from "./DocsNavigation";
import { useTranslations } from "next-intl";

export const DocsSidebar: FC<Omit<ComponentProps<typeof DocsNavigation>, 'className'>> = ({ links }) => {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const t = useTranslations('DocsSidebar');
  return (
    <aside
      className="sm:static sm:min-w-64"
    >
      <>
        <button
          className="peer sm:hidden fixed left-2 bottom-2 w-10 h-10 z-20 rounded-full bg-background-secondary font-[Material_Symbols_Outlined] aria-pressed:-rotate-180 transition duration-300"
          onClick={() => setSidebarHidden(prev => !prev)}
          aria-pressed={!sidebarHidden}
          role="toggle"
          aria-label={t('Toggle Docs Sidebar')}
        >
          &#xF716;
        </button>
        <DocsNavigation
          className={`left-0 -translate-x-full peer-aria-pressed:translate-0 fixed transition duration-300 ease-in-out top-0 z-10 sm:hidden w-full p-8 h-full bg-background-secondary`}
          links={links}
          hidden={sidebarHidden}
        />
      </>
      <DocsNavigation
        className={`hidden sm:block`}
        links={links}
      />
    </aside>
  );
};
