import type { VueElement } from 'vue'
import type { LAYOUTS } from '@/constants/layouts'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: LAYOUTS
    layoutComponent?: VueElement
  }
}
