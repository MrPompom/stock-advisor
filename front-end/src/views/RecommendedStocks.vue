 <!-- front-end/src/views/RecommendedStocks.vue -->
 <template>
    <div class="recommended-stocks">
      <h1 class="page-title">Actions Recommandées</h1>
      
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchRecommendedStocks" class="btn btn-primary">Réessayer</button>
      </div>
      
      <div v-else>
        <div class="last-updated">
          <p>Dernière mise à jour: {{ lastUpdated }}</p>
          <button @click="fetchRecommendedStocks" class="btn btn-secondary refresh-btn">
            Rafraîchir
          </button>
        </div>
        
        <div v-if="recommendedStocks.length === 0" class="no-data">
          <p>Aucune action recommandée actuellement.</p>
          <p>Les actions seront affichées ici lorsque leur prix sera inférieur au seuil défini.</p>
          <router-link to="/stocks" class="btn btn-primary">Voir toutes les actions</router-link>
        </div>
        
        <div v-else class="stocks-grid">
          <stock-item v-for="stock in recommendedStocks" :key="stock.symbol" :stock="stock" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import StockItem from '@/components/StockItem.vue';
  
  export default {
    name: 'RecommendedStocks',
    components: {
      StockItem
    },
    computed: {
      ...mapGetters(['recommendedStocks', 'isLoading', 'error', 'lastUpdated'])
    },
    created() {
      this.fetchRecommendedStocks();
    },
    mounted() {
      // Rafraîchir les données chaque fois que la page devient visible
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    beforeUnmount() {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },
    methods: {
      ...mapActions(['fetchRecommendedStocks']),
      handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
          this.fetchRecommendedStocks();
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .recommended-stocks {
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