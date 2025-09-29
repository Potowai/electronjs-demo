<template>
  <div class="uk-container uk-margin-top">
    <h1 class="uk-heading-primary">Gestion des Articles</h1>

    <div v-if="!loading && !error" class="uk-margin-bottom">
      <button @click="openCreateModal" class="uk-button uk-button-primary">
        <span uk-icon="icon: plus"></span>
        Créer un article
      </button>
    </div>

    <!-- Modal de création d'article -->
    <div id="create-article-modal" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Créer un nouvel article</h2>
        <form @submit.prevent="createArticle">
          <div class="uk-margin">
            <label class="uk-form-label" for="new-title">Titre</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="new-title"
                type="text"
                v-model="newArticle.title"
                required
              />
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="new-desc">Description</label>
            <div class="uk-form-controls">
              <textarea
                class="uk-textarea"
                id="new-desc"
                v-model="newArticle.desc"
                rows="5"
                required
              ></textarea>
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="new-author">Auteur</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="new-author"
                type="text"
                v-model="newArticle.author"
                required
              />
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="new-imgPath">URL de l'image (optionnel)</label>
            <div class="uk-form-controls">
              <input
                class="uk-input"
                id="new-imgPath"
                type="text"
                v-model="newArticle.imgPath"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <p class="uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">
              Annuler
            </button>
            <button
              class="uk-button uk-button-primary uk-margin-small-left"
              type="submit"
              :disabled="creating"
            >
              <span v-if="creating" uk-spinner="ratio: 0.8"></span>
              <span v-else>Créer</span>
            </button>
          </p>
        </form>
      </div>
    </div>

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
              <router-link
                :to="{ name: 'ArticleDetail', params: { id: article.id } }"
                class="uk-button uk-button-small uk-button-primary uk-margin-small-right"
              >
                Détail
              </router-link>
              <router-link
                :to="{ name: 'ArticleEdit', params: { id: article.id } }"
                class="uk-button uk-button-small uk-button-secondary uk-margin-small-right"
              >
                Modifier
              </router-link>
              <button
                @click="confirmDelete(article)"
                class="uk-button uk-button-small uk-button-danger"
              >
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

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
const creating = ref(false);
const newArticle = ref({
  title: '',
  desc: '',
  author: '',
  imgPath: '',
});

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

const openCreateModal = () => {
  newArticle.value = {
    title: '',
    desc: '',
    author: '',
    imgPath: '',
  };

  UIkit.modal('#create-article-modal').show();
};

const closeCreateModal = () => {
  UIkit.modal('#create-article-modal').hide();
};

const createArticle = async () => {
  creating.value = true;
  const token = localStorage.getItem('token');

  const articleData = {
    ...newArticle.value,
  };
  if (!articleData.imgPath || articleData.imgPath.trim() === '') {
    articleData.imgPath = 'https://placehold.co/400x200';
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create article.');
    }

    UIkit.notification({
      message: 'Article créé avec succès !',
      status: 'success',
      pos: 'top-center',
    });
    closeCreateModal();

    await fetchArticles();
  } catch (err) {
    UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
  } finally {
    creating.value = false;
  }
};

const confirmDelete = article => {
  UIkit.modal
    .confirm(
      `Êtes-vous sûr de vouloir supprimer l'article "${article.title}" ? Cette action est irréversible.`
    )
    .then(() => {
      deleteArticle(article.id);
    });
};

const deleteArticle = async articleId => {
  loading.value = true;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to delete article.');
    }

    UIkit.notification({
      message: 'Article supprimé avec succès !',
      status: 'success',
      pos: 'top-center',
    });

    await fetchArticles();
  } catch (err) {
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
