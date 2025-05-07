<!-- front-end/src/views/StockList.vue -->
<template>
    <div class="stock-list">
      <h1 class="page-title">Toutes les Actions</h1>
      
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchStocks" class="btn btn-primary">Réessayer</button>
      </div>
      
      <div v-else>
        <div class="last-updated">
          <p>Dernière mise à jour: {{ lastUpdated }}</p>
          <button @click="fetchStocks" class="btn btn-secondary refresh-btn">
            Rafraîchir
          </button>
        </div>
        
        <div v-if="stocks.length === 0" class="no-data">
          <p>Aucune action configurée. Veuillez ajouter des actions depuis le panneau d'administration.</p>
          <router-link to="/admin" class="btn btn-primary">Aller à l'administration</router-link>
        </div>
        
        <div v-else class="stocks-grid">
          <stock-item v-for="stock in stocks" :key="stock.symbol" :stock="stock" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import StockItem from '@/components/StockItem.vue';
  
  export default {
    name: 'StockList',
    components: {
      StockItem
    },
    computed: {
      ...mapGetters(['allStocks', 'isLoading', 'error', 'lastUpdated']),
      stocks() {
        return this.allStocks;
      }
    },
    methods: {
      ...mapActions(['fetchStocks'])
    },
    created() {
      this.fetchStocks();
    },
    mounted() {
      // Rafraîchir les données chaque fois que la page devient visible
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    beforeUnmount() {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },
    methods: {
      ...mapActions(['fetchStocks']),
      handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
          this.fetchStocks();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .stock-list {
    padding: 20px 0;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 30px;
    color: #2d3748;
  }
  
  .last-updated {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: #718096;
  }
  
  .refresh-btn {
    display: flex;
    align-items: center;
  }
  
  .refresh-btn:before {
    content: '↻';
    margin-right: 5px;
  }
  
  .stocks-grid {
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