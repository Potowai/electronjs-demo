<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-primary">Gestion des Articles</h1>

    <div v-if="loading" class="uk-text-center">
      <span uk-spinner="ratio: 2"></span>
      <p>Chargement des articles...</p>
    </div>

    <div v-else-if="error" class="uk-alert-danger" uk-alert>
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <table class="uk-table uk-table-striped uk-table-hover">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id">
            <td>{{ article.title }}</td>
            <td>{{ article.author }}</td>
            <td>
              <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }" class="uk-button uk-button-small uk-button-primary uk-margin-small-right">
                Détail
              </router-link>
              <router-link :to="{ name: 'ArticleEdit', params: { id: article.id } }" class="uk-button uk-button-small uk-button-secondary uk-margin-small-right">
                Modifier
              </router-link>
              <button @click="confirmDelete(article)" class="uk-button uk-button-small uk-button-danger">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UIkit from 'uikit';
import logger from '../../utils/logger';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchArticles = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/articles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des articles');
    }

    const data = await response.json();
    articles.value = data.data;
    logger.info(`Fetched ${articles.value.length} articles for management.`);
  } catch (err) {
    logger.error('Error fetching articles:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (article) => {
  UIkit.modal.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${article.title}" ? Cette action est irréversible.`).then(() => {
    deleteArticle(article.id);
  }, () => {
    logger.info(`Article deletion cancelled for article ${article.id}.`);
  });
};

const deleteArticle = async (articleId) => {
  loading.value = true;
  const token = localStorage.getItem('token');
  logger.info(`Deleting article ${articleId}.`);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to delete article.');
    }

    logger.info('Article deleted successfully.');
    UIkit.notification({ message: 'Article supprimé avec succès !', status: 'success', pos: 'top-center' });
    // Refresh the list
    await fetchArticles();
  } catch (err) {
    logger.error('Error deleting article:', err);
    UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchArticles);
</script>

<style scoped>
.uk-table {
  margin-top: 20px;
}

.uk-button-small {
  padding: 0 10px;
  font-size: 0.8rem;
}
</style>
