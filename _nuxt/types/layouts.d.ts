import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "blank"
declare module "/Users/stephenjasonwang/Development/nuxt3-erp/node_modules/.pnpm/nuxt@3.0.0_sass@1.57.1/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}