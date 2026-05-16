import type { MDXComponents } from 'mdx/types';

const components = {
  // Allows customizing built-in components, e.g. to add styling.
  h1: ({ children }) => (
    <h1 className="text-emphasis-secondary text-lg font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-emphasis-secondary text-base font-bold">{children}</h2>
  )
} satisfies MDXComponents;
 
export function useMDXComponents(): MDXComponents {
  return components;
}