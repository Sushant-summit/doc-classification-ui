// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
const routes = [
  {
    path: '/home',
    name: "HOME",
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/',
    name : "DOC_UPLOAD",
    component: () => import('@/pages/DocUpload.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  console.log(to.name);
  console.log(from.name);
  console.log(store.state)
  if (to.name == "HOME" && !store.state.relationsResults) {
    next({ name: "DOC_UPLOAD" });
  }
  else {
    next();
  }
});

export default router
