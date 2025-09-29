import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/auth/LoginPage.vue';
import SignupPage from '../components/auth/SignupPage.vue';
import ArticlesListPage from '../components/articles/ArticlesListPage.vue';
import ArticleDetailPage from '../components/articles/ArticleDetailPage.vue';
import ArticleEditPage from '../components/articles/ArticleEditPage.vue';
import ArticleManagementPage from '../components/articles/ArticleManagementPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupPage,
  },
  {
    path: '/',
    name: 'Home',
    component: ArticlesListPage, // La page d'accueil est maintenant la liste des articles
    meta: { requiresAuth: true },
  },
  {
    path: '/articles',
    name: 'ArticlesList',
    component: ArticlesListPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/management',
    name: 'ArticleManagement',
    component: ArticleManagementPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: ArticleDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/articles/:id/edit',
    name: 'ArticleEdit',
    component: ArticleEditPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté,
    // rediriger vers la page de connexion.
    next('/login');
  } else {
    next(); // Sinon, continuer la navigation.
  }
});

export default router;
