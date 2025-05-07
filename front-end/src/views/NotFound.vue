<!-- front-end/src/views/NotFound.vue -->
<template>
    <div class="not-found">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page non trouvée</h2>
        <p class="error-message">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <router-link to="/" class="btn btn-primary">Retour à l'accueil</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    text-align: center;
  }
  
  .not-found-content {
    max-width: 500px;
    padding: 40px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .error-code {
    font-size: 5rem;
    font-weight: 700;
    color: #4a6cf7;
    margin: 0 0 20px 0;
  }
  
  .error-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0 0 15px 0;
    color: #2d3748;
  }
  
  .error-message {
    color: #718096;
    margin-bottom: 30px;
  }
  </style>