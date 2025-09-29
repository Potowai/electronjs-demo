<template>
  <div class="uk-container uk-container-large uk-margin-top">
    <div v-if="article">
      <img :src="article.imgPath" :alt="article.title" class="uk-align-center uk-margin-bottom" style="width:100%; max-height:400px; object-fit: cover;">
      <h1>{{ article.title }}</h1>
      <p class="uk-text-meta">By {{ article.author }}</p>
      <hr>
      <p>{{ article.desc }}</p>
      <hr>
      <router-link to="/articles" class="uk-button uk-button-default">Back to list</router-link>
      <router-link :to="{ name: 'ArticleEdit', params: { id: article.id } }" class="uk-button uk-button-primary uk-margin-left">Modifier</router-link>
      <button @click="confirmDelete" class="uk-button uk-button-danger uk-margin-left" :disabled="loading">
        <span v-if="loading" uk-spinner="ratio: 0.8"></span>
        <span v-else>Supprimer</span>
      </button>
    </div>
    <div v-else-if="loading" class="uk-flex uk-flex-center uk-flex-middle" style="height: 50vh;">
      <span uk-spinner="ratio: 3"></span>
    </div>
    <div v-else-if="error" class="uk-alert-danger" uk-alert>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UIkit from 'uikit';
import logger from '../../utils/logger';

const route = useRoute();
const router = useRouter();
const article = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchArticle = async () => {
  const articleId = route.params.id;
  const token = localStorage.getItem('token');
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch article.');
    }

    const data = await response.json();
    article.value = data.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  UIkit.modal.confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.').then(() => {
    deleteArticle();
  }, () => {
    logger.info('Article deletion cancelled by user.');
  });
};

const deleteArticle = async () => {
  loading.value = true;
  const token = localStorage.getItem('token');
  logger.info(`Deleting article ${article.value.id}.`);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${article.value.id}`, {
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
    router.push({ name: 'ArticlesList' });
  } catch (err) {
    logger.error('Error deleting article:', err);
    UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchArticle);
</script>
