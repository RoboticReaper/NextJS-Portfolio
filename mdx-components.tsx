import type { MDXComponents } from 'mdx/types'
import { title, subtitle } from "@/components/primitives";
import { Link } from "@heroui/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <div className="text-center">
        <h1 className={title()}>{children}</h1>
      </div>
    ),
    h2: ({ children }) => (
      <div className="text-center">
        <h2 className={subtitle()}>{children}</h2>
      </div>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside grid m-2">{children}</ul>
    ),
    a: ({ children, href}) => (
      <Link href={href}>
        {children}
      </Link>
    ),
    ...components,
  }
}