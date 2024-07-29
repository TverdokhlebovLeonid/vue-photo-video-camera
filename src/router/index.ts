import { createRouter, createWebHistory } from 'vue-router'
import { loadLayoutMiddleware } from '@/router/layoutMiddleware'
import type { RouteRecordRaw } from 'vue-router'
import { LAYOUTS } from '@/constants/layouts'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeScreen.vue'),
    meta: {
      layout: LAYOUTS.default,
      title: 'Диспетчер устройств',
    },
  },
  {
    path: '/camera',
    name: 'camera',
    component: () => import('@/views/CameraScreen.vue'),
    meta: {
      layout: LAYOUTS.withoutHeader,
      title: 'Видео камера',
    },
  },
]

const router = createRouter({
  history: createWebHistory(''),
  routes,
})

router.beforeEach(loadLayoutMiddleware)
export default router
