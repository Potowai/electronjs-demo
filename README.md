# ElectronJS Demo App

Cette application est une démonstration d'une application de bureau construite avec ElectronJS, Vite et Vue.js.

## Fonctionnalités principales
- Authentification (connexion, inscription)
- Gestion des articles (liste, détail, édition)
- Page de chargement personnalisée
- Architecture modulaire avec composants Vue

## Test de connexion avec des utilisateurs mockés
Mail :
```sh
isaac@gmail.com
```

Password :
```sh
password
```

## Structure du projet
```
eslint.config.js
forge.config.js
index.html
package.json
vite.main.config.mjs
vite.preload.config.mjs
vite.renderer.config.mjs
src/
  App.vue
  index.css
  main.js
  preload.js
  renderer.js
  assets/
    images/
      spinner.gif
  components/
    LoadingPage.vue
    articles/
      ArticleDetailPage.vue
      ArticleEditPage.vue
      ArticleManagementPage.vue
      ArticlesListPage.vue
    auth/
      LoginPage.vue
      SignupPage.vue
  router/
    index.js
```

## Installation

Vous pouvez également installer l'application en téléchargeant la dernière release depuis la page GitHub du projet.  
Téléchargez le fichier exécutable correspondant à votre système d'exploitation et suivez les instructions d'installation.

1. Clonez le dépôt :
```sh
git clone http://github.com/Potowai/electronjs-demo
```
2. Installez les dépendances :
```sh
npm install
```
3. Lancez l'application :
```sh
npm run start
```

## Technologies utilisées
- ElectronJS
- Vite
- Vue.js

## Auteur
- Potowai

## Licence
Ce projet est sous licence MIT.