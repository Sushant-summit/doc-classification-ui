// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import HomePage from '../pages/HomePage.vue';
import DocUpload from '../pages/DocUpload.vue';
const routes = [
  {
    path: '/home',
    name: "HOME",
    component: HomePage,
  },
  {
    path: '/',
    name : "DOC_UPLOAD",
    component: DocUpload,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.name == "HOME" && !store.state.relationsResults) {
    next({ name: "DOC_UPLOAD" });
  }
  else {
    next();
  }
});

export default router
