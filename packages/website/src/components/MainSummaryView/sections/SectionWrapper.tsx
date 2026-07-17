import { FC, PropsWithChildren } from "react";

type SectionWrapperProps = PropsWithChildren<{
  title: string,
  description?: string,
  className?: string,
  onClick?: () => void;
}>;

export const SectionWrapper: FC<SectionWrapperProps> = ({
  title,
  description,
  className,
  children,
  onClick
}) => (
  <section
    className={`flex flex-col bg-emphasis-tertiary rounded-sm p-1 sm:p-2 ${className} ${onClick ? 'hover:scale-101 hover:shadow focus-within:scale-101 focus-within:shadow transition cursor-pointer' : ''}`}
    {...(onClick ? {
      tabIndex: 0,
      onClick
    } : {})}
  >
    <h2
      className="font-serif font-bold text-emphasis text-xl"
    >
      {title}
    </h2>
    {description &&
      <p
        className="font-serif text-emphasis text-lg"
      >
        {description}
      </p>
    }
    <div
      className="grow mt-1 p-4 rounded-sm bg-background place-center"
    >
      {children}
    </div>
  </section>
);
