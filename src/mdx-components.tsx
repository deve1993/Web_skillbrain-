import type { MDXComponents } from "mdx/types";
import { docsMdxComponents } from "@/components/docs/mdx-components";

export function useMDXComponents(): MDXComponents {
  return docsMdxComponents;
}
