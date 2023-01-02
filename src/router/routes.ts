import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/App.vue';
export function createRoutes(): Array<RouteRecordRaw> {
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: Home,
      /* children: [
        {
          path: '/',
          component: ,
        },
      ], */
    },
    // Always leave this as last one,
    // but you can also remove it
  ];
  return routes;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...createRoutes(),
  ],
});

export default router;
