<!-- front-end/src/components/AdminControls.vue -->
<template>
    <div class="admin-controls card">
      <h3 class="section-title">Contrôles Administrateur</h3>
      
      <div class="info-panel">
        <p>
          <strong>Dernière mise à jour des prix :</strong> 
          <span v-if="lastUpdate">{{ formatDate(lastUpdate) }}</span>
          <span v-else>Jamais</span>
        </p>
      </div>
      
      <div class="action-panel">
        <button 
          class="btn btn-primary" 
          @click="refreshStocksData" 
          :disabled="isRefreshing"
        >
          <span v-if="isRefreshing">
            <span class="spinner-icon"></span> Mise à jour en cours...
          </span>
          <span v-else>
            Rafraîchir les données de prix
          </span>
        </button>
        
        <div v-if="refreshMessage" class="refresh-message" :class="{ 'error': refreshError }">
          {{ refreshMessage }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AdminControls',
    data() {
      return {
        lastUpdate: null,
        isRefreshing: false,
        refreshMessage: '',
        refreshError: false
      };
    },
    created() {
      this.getLastUpdateTime();
    },
    methods: {
      async getLastUpdateTime() {
        try {
          const response = await axios.get('/api/admin/last-update');
          this.lastUpdate = response.data.lastUpdate ? new Date(response.data.lastUpdate) : null;
        } catch (error) {
          console.error('Error getting last update time:', error);
        }
      },
      
      async refreshStocksData() {
        this.isRefreshing = true;
        this.refreshMessage = '';
        this.refreshError = false;
        
        try {
          const response = await axios.post('/api/admin/refresh-stocks');
          this.refreshMessage = response.data.message;
          this.getLastUpdateTime(); // Mettre à jour l'heure
        } catch (error) {
          this.refreshError = true;
          this.refreshMessage = `Erreur: ${error.response?.data?.message || error.message}`;
          console.error('Error refreshing stocks data:', error);
        } finally {
          this.isRefreshing = false;
        }
      },
      
      formatDate(date) {
        return new Date(date).toLocaleString();
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-controls {
    margin-bottom: 30px;
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #2d3748;
  }
  
  .info-panel {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f8fafc;
    border-radius: 4px;
  }
  
  .action-panel {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .refresh-message {
    padding: 10px;
    background-color: #f0fff4;
    border-radius: 4px;
    color: #2f855a;
  }
  
  .refresh-message.error {
    background-color: #fff5f5;
    color: #e53e3e;
  }
  
  .spinner-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-right: 5px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>