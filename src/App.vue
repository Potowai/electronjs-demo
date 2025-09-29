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
import logger from './utils/logger.js';

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

    const logout = () => {
      localStorage.removeItem('token');
      isLoggedIn.value = false;
      router.push('/login');
    };

    const onLoadingComplete = () => {
      logger.info('Application loading completed, showing main interface');
      isLoading.value = false;
    };

    watch(
      () => route.path,
      () => {
        isLoggedIn.value = !!localStorage.getItem('token');
      }
    );

    onMounted(() => {
      logger.info('Vue application mounted, starting loading sequence');
    });

    return {
      isLoggedIn,
      isLoading,
      logout,
      onLoadingComplete,
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
