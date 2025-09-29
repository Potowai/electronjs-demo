<template>
  <div class="uk-flex uk-flex-center uk-flex-middle" uk-height-viewport>
    <div class="uk-width-large uk-padding">
      <div class="uk-card uk-card-default uk-card-body uk-box-shadow-large">
        <h3 class="uk-card-title uk-text-center">Connexion</h3>
        <form @submit.prevent="login">
          <div class="uk-margin">
            <div class="uk-inline uk-width-1-1">
              <span class="uk-form-icon" uk-icon="icon: mail"></span>
              <input class="uk-input" type="email" v-model="email" placeholder="Email" required />
            </div>
          </div>
          <div class="uk-margin">
            <div class="uk-inline uk-width-1-1">
              <span class="uk-form-icon" uk-icon="icon: lock"></span>
              <input
                class="uk-input"
                type="password"
                v-model="password"
                placeholder="Mot de passe"
                required
              />
            </div>
          </div>
          <div class="uk-margin">
            <button
              class="uk-button uk-button-primary uk-button-large uk-width-1-1"
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" uk-spinner="ratio: 0.8"></span>
              <span v-else>Se connecter</span>
            </button>
          </div>
          <div v-if="error" class="uk-alert-danger" uk-alert>
            <p>{{ error }}</p>
          </div>
          <div class="uk-text-small uk-text-center">
            <router-link to="/signup">Pas encore de compte ? S'inscrire</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter();

    const login = async () => {
      loading.value = true;
      error.value = null;
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur de connexion');
        }

        localStorage.setItem('token', data.token);

        router.push('/');
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      error,
      login,
    };
  },
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
