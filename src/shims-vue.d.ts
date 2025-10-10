/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type */
/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // Use empty object types and `any` here intentionally for SFC typings.
  // ESLint rules are disabled for this file because declaration files
  // commonly need these permissive types for compatibility.
  const component: DefineComponent<{}, {}, any>
  export default component
}
