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
  {
    path: '/upload',
    component: () => import('@/pages/DocUpload.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
