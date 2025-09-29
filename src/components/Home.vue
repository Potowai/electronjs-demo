<template>
  <div class="home">
    <h1 class="uk-heading-primary">Accueil</h1>
    <p>Bienvenue sur la page d'accueil de votre application Electron avec Vue.js !</p>
    
    <!-- Test UIkit avec des boutons -->
    <div class="uk-margin">
      <button class="uk-button uk-button-primary uk-margin-small-right">Bouton Primary</button>
      <button class="uk-button uk-button-secondary uk-margin-small-right">Bouton Secondary</button>
      <button class="uk-button uk-button-danger">Bouton Danger</button>
    </div>
    
    <!-- Test UIkit avec une carte -->
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
      <h3 class="uk-card-title">Carte UIkit</h3>
      <p>Cette carte démontre que UIkit fonctionne correctement.</p>
      <div class="uk-alert-success" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <p>Succès ! UIkit est maintenant actif dans votre application.</p>
      </div>
    </div>
    
    <div class="uk-margin-top">
      <div class="uk-button-group">
        <router-link to="/festivals" class="uk-button uk-button-default">Festivals Français</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}
</style>