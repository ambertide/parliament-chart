import { FC, PropsWithChildren } from "react";

type SectionWrapperProps = PropsWithChildren<{
  title: string,
  description?: string,
  className?: string
}>;

export const SectionWrapper: FC<SectionWrapperProps> = ({
  title,
  description,
  className,
  children
}) => (
  <section
    className={`flex flex-col bg-emphasis-tertiary rounded-sm p-1 sm:p-2 ${className}`}
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
