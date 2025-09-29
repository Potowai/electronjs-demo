<template>
  <div class="uk-container uk-margin-top">
    import { ref, onMounted } from 'vue'; import { useRouter, useRoute } from 'vue-router'; import
    UIkit from 'uikit';
    <h2>Modifier l'article</h2>
    <form v-if="article" @submit.prevent="updateArticle">
      <div class="uk-margin">
        <label class="uk-form-label" for="title">Titre</label>
        <div class="uk-form-controls">
          <input class="uk-input" id="title" type="text" v-model="article.title" required />
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="desc">Description</label>
        <div class="uk-form-controls">
          <textarea
            class="uk-textarea"
            id="desc"
            v-model="article.desc"
            rows="5"
            required
          ></textarea>
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="imgPath">URL de l'image</label>
        <div class="uk-form-controls">
          <input class="uk-input" id="imgPath" type="text" v-model="article.imgPath" />
        </div>
      </div>

      <div class="uk-margin">
        <button class="uk-button uk-button-primary" type="submit" :disabled="loading">
          <span v-if="loading" uk-spinner="ratio: 0.8"></span>
          <span v-else>Mettre à jour</span>
        </button>
        <router-link
          :to="{ name: 'ArticleDetail', params: { id: article.id } }"
          class="uk-button uk-button-default uk-margin-left"
          >Annuler</router-link
        >
      </div>
    </form>
    <div v-else-if="loading" class="uk-flex uk-flex-center uk-flex-middle" style="height: 50vh">
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

const route = useRoute();
const router = useRouter();
const article = ref(null);
const loading = ref(false);
const error = ref(null);
const articleId = route.params.id;

const fetchArticle = async () => {
  loading.value = true;
  error.value = null;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${articleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch article data.');
    const data = await response.json();
    article.value = data.data;
  } catch (err) {
    error.value = err.message;
    UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
  } finally {
    loading.value = false;
  }
};

const updateArticle = async () => {
  loading.value = true;
  error.value = null;
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    const saveResponse = await fetch(`${apiUrl}/articles/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: article.value.title,
        desc: article.value.desc,
        imgPath: article.value.imgPath,
        author: article.value.author,
      }),
    });

    const saveData = await saveResponse.json();
    if (!saveResponse.ok) {
      throw new Error(saveData.message || 'Failed to save the new article.');
    }
    const deleteResponse = await fetch(`${apiUrl}/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    UIkit.notification({
      message: 'Article mis à jour avec succès !',
      status: 'success',
      pos: 'top-center',
    });
    router.push({ name: 'ArticlesList' });
  } catch (err) {
    error.value = err.message;
    UIkit.notification({ message: err.message, status: 'danger', pos: 'top-center' });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchArticle);
</script>
