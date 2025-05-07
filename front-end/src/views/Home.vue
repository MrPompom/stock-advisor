<!-- front-end/src/views/Home.vue -->
<template>
    <div class="home">
      <div class="hero">
        <h1 class="hero-title">Bienvenue sur Stock Advisor</h1>
        <p class="hero-subtitle">Votre assistant pour des investissements boursiers informés</p>
        <div class="hero-actions">
          <router-link to="/stocks" class="btn btn-primary">Voir toutes les actions</router-link>
          <router-link to="/recommended" class="btn btn-secondary">Actions recommandées</router-link>
        </div>
      </div>
  
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">Suivi des prix en temps réel</h3>
          <p class="feature-desc">Obtenez les derniers prix du marché à chaque visite de la page</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h3 class="feature-title">Recommandations personnalisées</h3>
          <p class="feature-desc">Définissez vos propres seuils pour recevoir des recommandations d'achat</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3 class="feature-title">Paramétrage flexible</h3>
          <p class="feature-desc">Configurez facilement votre liste d'actions et vos seuils depuis le panneau d'administration</p>
        </div>
      </div>
  
      <div class="get-started">
        <h2 class="section-title">Pour commencer</h2>
        <ol class="steps-list">
          <li class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4 class="step-title">Accédez au panneau d'administration</h4>
              <p class="step-desc">Cliquez sur "Administration" dans la barre de navigation</p>
            </div>
          </li>
          
          <li class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4 class="step-title">Ajoutez des actions à suivre</h4>
              <p class="step-desc">Créez de nouveaux seuils pour les actions qui vous intéressent</p>
            </div>
          </li>
          
          <li class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4 class="step-title">Consultez vos recommandations</h4>
              <p class="step-desc">Visitez la page "Actions Recommandées" pour voir les opportunités d'achat</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  };
  </script>
  
  <style scoped>
  .home {
    padding: 20px 0;
  }
  
  .hero {
    text-align: center;
    padding: 60px 20px;
    background-color: #f9fafb;
    border-radius: 8px;
    margin-bottom: 40px;
  }
  
  .hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: #2d3748;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    color: #718096;
    margin-bottom: 30px;
  }
  
  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
  
  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 50px;
  }
  
  .feature-card {
    flex: 1;
    min-width: 250px;
    padding: 30px;
    text-align: center;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
  }
  
  .feature-icon {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .feature-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #2d3748;
  }
  
  .feature-desc {
    color: #718096;
    line-height: 1.5;
  }
  
  .get-started {
    padding: 40px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .section-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
    color: #2d3748;
  }
  
  .steps-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .step-item {
    display: flex;
    margin-bottom: 30px;
  }
  
  .step-number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: #4a6cf7;
    color: white;
    font-weight: 700;
    border-radius: 50%;
    margin-right: 20px;
    flex-shrink: 0;
  }
  
  .step-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #2d3748;
  }
  
  .step-desc {
    color: #718096;
    margin: 0;
    line-height: 1.5;
  }
  </style>