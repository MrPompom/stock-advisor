// front-end/vue.config.js
module.exports = {
    // Désactiver ESLint pendant le développement
    lintOnSave: false,
    
    // Configuration du proxy pour l'API (optionnel mais utile)
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  };