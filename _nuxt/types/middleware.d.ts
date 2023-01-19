import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "/Users/stephenjasonwang/Development/nuxt3-erp/node_modules/.pnpm/nuxt@3.0.0_sass@1.57.1/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}