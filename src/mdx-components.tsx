import type { MDXComponents } from 'mdx/types';
import { JSX } from 'react';


const components = {
  // Allows customizing built-in components, e.g. to add styling.
  p: ({ children }) => (
    <p
      className="mb-2.5"
    >
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h1 className="text-emphasis-secondary text-lg font-bold mb-2.5">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-emphasis-secondary text-base font-bold mb-2.5">{children}</h2>
  ),
  pre: ({ children }) => ( 
    <pre className="font-mono overflow-x-scroll mb-2.5 bg-background-secondary p-4">{children}</pre>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2.5">{children}</ul>
  ),
  table: ({ children }) => (
    <table className="mb-2.5">{children}</table>
  )
} satisfies MDXComponents;
 
export function useMDXComponents(): MDXComponents {
  return components;
}