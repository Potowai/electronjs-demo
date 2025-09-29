<template>
  <div
    class="uk-section uk-section-muted uk-flex uk-flex-middle uk-animation-fade"
    uk-height-viewport
  >
    <div class="uk-width-1-1">
      <div class="uk-container">
        <div class="uk-grid-margin uk-grid uk-grid-stack" uk-grid>
          <div class="uk-width-1-1@m">
            <div
              class="uk-margin uk-width-large uk-margin-auto uk-card uk-card-default uk-card-body uk-box-shadow-large"
            >
              <h3 class="uk-card-title uk-text-center">Inscription</h3>
              <form @submit.prevent="signup">
                <div class="uk-margin">
                  <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                    <input
                      class="uk-input"
                      type="text"
                      v-model="name"
                      placeholder="Nom d'utilisateur"
                      required
                    />
                  </div>
                </div>
                <div class="uk-margin">
                  <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: mail"></span>
                    <input
                      class="uk-input"
                      type="email"
                      v-model="email"
                      placeholder="Email"
                      required
                    />
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
                  <div class="uk-inline uk-width-1-1">
                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                    <input
                      class="uk-input"
                      type="password"
                      v-model="passwordConfirm"
                      placeholder="Confirmer le mot de passe"
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
                    <span v-else>S'inscrire</span>
                  </button>
                </div>
                <div class="uk-text-small uk-text-center">
                  <router-link to="/login">Déjà un compte ? Se connecter</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UIkit from 'uikit';

export default {
  name: 'SignupPage',
  setup() {
    const email = ref('');
    const password = ref('');
    const passwordConfirm = ref('');
    const name = ref('');
    const loading = ref(false);
    const router = useRouter();

    const signup = async () => {
      if (password.value !== passwordConfirm.value) {
        UIkit.notification({
          message: 'Les mots de passe ne correspondent pas.',
          status: 'danger',
          pos: 'top-center',
          timeout: 5000,
        });
        return;
      }

      loading.value = true;

      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${apiUrl}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: name.value,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de l'inscription");
        }

        UIkit.notification({
          message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
          status: 'success',
          pos: 'top-center',
          timeout: 5000,
        });

        router.push('/login');
      } catch (err) {
        UIkit.notification({
          message: err.message,
          status: 'danger',
          pos: 'top-center',
          timeout: 5000,
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      passwordConfirm,
      name,
      loading,
      signup,
    };
  },
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
