import { useMDXComponents as getThemeComponents } from 'nextra-theme-blog' // nextra-theme-docs or your custom theme
 
// Get the default MDX components
const themeComponents = getThemeComponents()
 
// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components
  }
}