import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import FestivalsPage from '../components/FestivalsPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/festivals',
    name: 'FestivalsPage',
    component: FestivalsPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;