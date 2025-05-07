// front-end/src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);

// Intercepteur global pour les erreurs
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Info:', info);
};

app.mount('#app');

// front-end/vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};