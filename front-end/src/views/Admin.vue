<!-- front-end/src/views/Admin.vue -->
<template>
    <div class="admin">
      <h1 class="page-title">Administration</h1>
       <!-- Intégrer les contrôles administrateur -->
    <admin-controls />
      
      <div class="admin-header">
        <p class="admin-desc">Gérez les seuils de prix pour vos actions suivies</p>
        <router-link to="/admin/threshold/new" class="btn btn-primary">
          Ajouter une nouvelle action
        </router-link>
      </div>
      
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchThresholds" class="btn btn-primary">Réessayer</button>
      </div>
      
      <div v-else>
        <div v-if="thresholds.length === 0" class="no-data">
          <p>Aucune action configurée.</p>
          <p>Ajoutez des actions pour commencer à recevoir des recommandations.</p>
          <router-link to="/admin/threshold/new" class="btn btn-primary">
            Ajouter une nouvelle action
          </router-link>
        </div>
        
        <div v-else class="thresholds-grid">
          <threshold-item 
            v-for="threshold in thresholds" 
            :key="threshold._id" 
            :threshold="threshold"
            @delete="deleteThreshold"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { mapGetters, mapActions } from 'vuex';
import ThresholdItem from '@/components/ThresholdItem.vue';
import AdminControls from '@/components/AdminControls.vue'; // Importer le nouveau composant

  
  export default {
    name: 'Admin',
    components: {
      ThresholdItem,
      AdminControls
    },
    computed: {
      ...mapGetters(['allThresholds', 'isLoading', 'error']),
      thresholds() {
        return this.allThresholds;
      }
    },
    created() {
      this.fetchThresholds();
    },
    methods: {
      ...mapActions(['fetchThresholds', 'deleteThreshold'])
    }
  };
  </script>
  
  <style scoped>
  .admin {
    padding: 20px 0;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #2d3748;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .admin-desc {
    color: #718096;
    margin: 0;
  }
  
  .thresholds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .error-message {
    padding: 20px;
    background-color: #fff5f5;
    border-radius: 8px;
    color: #c53030;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .no-data {
    padding: 40px;
    text-align: center;
    background-color: #f9fafb;
    border-radius: 8px;
    color: #718096;
  }
  </style>