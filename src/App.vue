<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="uk-navbar-container uk-flex" uk-navbar v-if="isLoggedIn">
        <ul class="uk-navbar-nav uk-padding">
          <li class="uk-active"><router-link to="/articles">Liste des Articles</router-link></li>
          <li><router-link to="/articles/management">Gestion des Articles</router-link></li>
        </ul>
        <ul class="uk-navbar-nav uk-padding">
          <li>
            <a @click="logout">
              <span uk-icon="icon: sign-out"></span>
              Déconnexion
            </a>
          </li>
        </ul>
    </nav>

    <div :class="{'uk-container uk-container-expand uk-margin-top uk-padding-bottom': isLoggedIn}">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLoggedIn = ref(!!localStorage.getItem('token'));

    const logout = () => {
      localStorage.removeItem('token');
      isLoggedIn.value = false;
      router.push('/login');
    };

    // Mettre à jour l'état de connexion lorsque la route change
    watch(() => route.path, () => {
      isLoggedIn.value = !!localStorage.getItem('token');
    });

    return {
      isLoggedIn,
      logout,
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
