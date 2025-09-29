<template>
  <div id="app">
    <!-- Page de chargement -->
    <LoadingPage v-if="isLoading" @loading-complete="onLoadingComplete" />

    <!-- Application principale -->
    <div v-else>
      <!-- Navigation -->
      <nav class="uk-navbar-container uk-flex" uk-navbar v-if="isLoggedIn">
        <ul class="uk-navbar-nav uk-padding">
          <li :class="{ 'uk-active': $route.path === '/articles' }">
            <router-link to="/articles">Liste des Articles</router-link>
          </li>
          <li :class="{ 'uk-active': $route.path === '/articles/management' }">
            <router-link to="/articles/management">Gestion des Articles</router-link>
          </li>
        </ul>
        <ul class="uk-navbar-nav uk-padding uk-margin-auto-left">
          <li>
            <a @click="logout">
              <span uk-icon="icon: sign-out"></span>
              Déconnexion
            </a>
          </li>
        </ul>
      </nav>

      <div
        :class="{ 'uk-container uk-container-expand uk-margin-top uk-padding-bottom': isLoggedIn }"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoadingPage from './components/LoadingPage.vue';

export default {
  name: 'App',
  components: {
    LoadingPage,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLoggedIn = ref(!!localStorage.getItem('token'));
    const isLoading = ref(true);
    const apiAwake = ref(false);
    let pingInterval = null;

    const API_URL = import.meta.env.VITE_API_URL || '';

    // Fonction pour pinger l'API
    const pingApi = async () => {
      try {
        const response = await fetch(`${API_URL}/check`, { method: 'GET' });
        if (response.ok) {
          apiAwake.value = true;
          clearInterval(pingInterval);
          onLoadingComplete();
        }
      } catch (e) {
        // API non réveillée, on continue
      }
    };

    const startApiWakeup = () => {
      apiAwake.value = false;
      isLoading.value = true;
      pingInterval = setInterval(pingApi, 1000);
      pingApi(); // Premier essai immédiat
    };

    const logout = () => {
      localStorage.removeItem('token');
      isLoggedIn.value = false;
      router.push('/login');
    };

    const onLoadingComplete = () => {
      isLoading.value = false;
      apiAwake.value = true;
      if (pingInterval) clearInterval(pingInterval);
      // Redirection vers /login si pas connecté
      if (!localStorage.getItem('token') && route.path !== '/login' && route.path !== '/signup') {
        router.replace('/login');
      } else if (localStorage.getItem('token') && (route.path === '/login' || route.path === '/signup')) {
        router.replace('/');
      }
    };

    watch(
      () => route.path,
      () => {
        isLoggedIn.value = !!localStorage.getItem('token');
      }
    );

    onMounted(() => {
      startApiWakeup();
    });

    return {
      isLoggedIn,
      isLoading,
      logout,
      onLoadingComplete,
      apiAwake,
    };
  },
};
</script>

<style>
#app {
  height: 100vh;
  width: 90vw;
}
</style>
