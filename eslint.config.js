import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettierConfig from '@vue/eslint-config-prettier';

export default [

  js.configs.recommended,


  ...vue.configs['flat/essential'],


  prettierConfig,

  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },


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

        contextBridge: 'readonly',
        ipcRenderer: 'readonly',
      },
    },
  },


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

      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];