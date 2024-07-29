import type { RouteLocationNormalized } from 'vue-router'
import { LAYOUTS, LAYOUTS_MAP } from '@/constants/layouts'

export async function loadLayoutMiddleware(route: RouteLocationNormalized): Promise<void> {
  const layout = route?.meta?.layout || LAYOUTS.default
  const fileName = LAYOUTS_MAP[layout]

  const component = await import(`@/layouts/${fileName}.vue`)
  route.meta.layoutComponent = component.default
}
