import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettierConfig from '@vue/eslint-config-prettier';

export default [
  // Configuration de base pour JavaScript
  js.configs.recommended,

  // Configuration pour Vue.js
  ...vue.configs['flat/essential'],

  // Configuration Prettier
  prettierConfig,

  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },

  // Configuration pour les fichiers Vue (environnement browser)
  {
    name: 'app/vue-files',
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
  },

  // Configuration pour main.js (environnement Node.js)
  {
    name: 'app/main-files',
    files: ['src/main.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        MAIN_WINDOW_VITE_DEV_SERVER_URL: 'readonly',
        MAIN_WINDOW_VITE_NAME: 'readonly',
      },
    },
  },

  // Configuration pour preload.js (environnement Node.js avec Electron)
  {
    name: 'app/preload-files',
    files: ['src/preload.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        // APIs Electron
        contextBridge: 'readonly',
        ipcRenderer: 'readonly',
      },
    },
  },

  // Configuration pour renderer.js (environnement browser)
  {
    name: 'app/renderer-files',
    files: ['src/renderer.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
      },
    },
  },

  // Configuration pour les utilitaires (environnement Node.js/browser mixte)
  {
    name: 'app/utils-files',
    files: ['src/utils/**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
  },

  // Configuration pour le router (environnement browser)
  {
    name: 'app/router-files',
    files: ['src/router/**/*.js'],
    languageOptions: {
      globals: {
        localStorage: 'readonly',
        console: 'readonly',
        window: 'readonly',
      },
    },
  },

  {
    rules: {
      // Règles personnalisées
      'vue/multi-word-component-names': 'off', // Désactiver pour les composants simples
      'no-unused-vars': 'warn', // Avertissement au lieu d'erreur
      'no-console': 'off', // Permettre console.log en développement
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];