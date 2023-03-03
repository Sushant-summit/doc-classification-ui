// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/detail',
    component: () => import('@/pages/DetailViewPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
