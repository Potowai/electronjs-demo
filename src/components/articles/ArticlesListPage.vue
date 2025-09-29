<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-primary">Liste des Articles</h1>
    <div v-if="loading" class="uk-text-center">
      <span uk-spinner="ratio: 2"></span>
      <p>Chargement des articles...</p>
    </div>
    <div v-else-if="error" class="uk-alert-danger" uk-alert>
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <div class="uk-child-width-1-2@m uk-grid-match" uk-grid>
        <div v-for="article in articles" :key="article.id">
          <div class="uk-card uk-card-default uk-card-hover uk-margin-bottom">
            <div class="uk-card-media-top">
              <img :src="article.imgPath" :alt="article.title" />
            </div>
            <div class="uk-card-body">
              <h3 class="uk-card-title">{{ article.title }}</h3>
              <p class="uk-text-meta">Par {{ article.author }}</p>
              <p>{{ article.desc }}</p>
            </div>
            <div class="uk-card-footer">
              <router-link
                :to="{ name: 'ArticleDetail', params: { id: article.id } }"
                class="uk-button uk-button-text"
              >
                Lire la suite
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'ArticlesListPage',
  setup() {
    const articles = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des articles');
        }

        const data = await response.json();
        articles.value = data.data;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchArticles);

    return {
      articles,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
.uk-card-media-top img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
