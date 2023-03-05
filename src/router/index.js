// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: "HOME",
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/',
    component: () => import('@/pages/DocUpload.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
