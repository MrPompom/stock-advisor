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
      <div class="controls-section">
        <div class="last-updated">
          <p>Dernière mise à jour: {{ lastUpdated }}</p>
          <button @click="fetchStocks" class="btn btn-secondary refresh-btn">
            <span class="refresh-icon">↻</span>
            <span class="refresh-text">Rafraîchir</span>
          </button>
        </div>
        
        <!-- Filtres et statistiques -->
        <div v-if="stocks.length > 0" class="filters-stats">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">{{ stocks.length }}</span>
              <span class="stat-label">Actions totales</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ buyCount }}</span>
              <span class="stat-label">À acheter</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ sellCount }}</span>
              <span class="stat-label">À vendre</span>
            </div>
          </div>
          
          <div class="filters">
            <div class="filter-group">
              <label>Type d'action:</label>
              <select v-model="filterType" class="form-control form-control-sm">
                <option value="all">Toutes</option>
                <option value="acheter">À acheter</option>
                <option value="vendre">À vendre</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Niveau de risque:</label>
              <select v-model="filterRisk" class="form-control form-control-sm">
                <option value="all">Tous</option>
                <option value="faible">Faible</option>
                <option value="moyen">Moyen</option>
                <option value="elevé">Élevé</option>
                <option value="sevère">Sévère</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Trier par:</label>
              <select v-model="sortBy" class="form-control form-control-sm">
                <option value="name">Nom</option>
                <option value="symbol">Symbole</option>
                <option value="price">Prix actuel</option>
                <option value="threshold">Seuil de prix</option>
                <option value="risk">Niveau de risque</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredStocks.length === 0" class="no-data">
        <p v-if="stocks.length === 0">
          Aucune action configurée. Veuillez ajouter des actions depuis le panneau d'administration.
        </p>
        <p v-else>
          Aucune action ne correspond aux filtres sélectionnés.
        </p>
        <router-link v-if="stocks.length === 0" to="/admin" class="btn btn-primary">
          Aller à l'administration
        </router-link>
      </div>
      
      <div v-else class="stocks-grid">
        <div v-for="stock in filteredStocks" :key="stock.symbol" class="stock-card">
          <div class="stock-header">
            <div class="stock-title">
              <h3 class="stock-symbol">{{ stock.symbol }}</h3>
              <p class="stock-name">{{ stock.name }}</p>
            </div>
            <div class="stock-badges">
              <span v-if="stock.isRecommended" class="status-badge recommended">Recommandé</span>
              <span class="action-badge" :class="stock.actionType || 'acheter'">
                {{ stock.actionType === 'vendre' ? 'VENTE' : 'ACHAT' }}
              </span>
              <span class="risk-badge" :class="`risk-${stock.riskLevel || 'moyen'}`">
                {{ capitalizeRisk(stock.riskLevel || 'moyen') }}
              </span>
            </div>
          </div>
          
          <div class="stock-body">
            <div class="price-info">
              <div class="price-item">
                <span class="price-label">Prix actuel</span>
                <span class="price-value" v-if="stock.price">${{ formatPrice(stock.price) }}</span>
                <span class="price-value no-price" v-else>-</span>
              </div>
              <div class="price-item">
                <span class="price-label">Seuil</span>
                <span class="price-value">${{ formatPrice(stock.thresholdPrice) }}</span>
              </div>
            </div>
          </div>
          
          <div class="stock-footer">
            <a 
              :href="stock.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="btn btn-primary view-btn"
            >
              Voir l'action
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'StockList',
  data() {
    return {
      filterType: 'all',
      filterRisk: 'all',
      sortBy: 'name'
    };
  },
  computed: {
    ...mapGetters(['allStocks', 'isLoading', 'error', 'lastUpdated']),
    
    stocks() {
      return this.allStocks;
    },
    
    buyCount() {
      return this.stocks.filter(s => s.actionType !== 'vendre').length;
    },
    
    sellCount() {
      return this.stocks.filter(s => s.actionType === 'vendre').length;
    },
    
    filteredStocks() {
      let stocks = [...this.stocks];
      
      // Filtrage par type
      if (this.filterType !== 'all') {
        stocks = stocks.filter(s => s.actionType === this.filterType);
      }
      
      // Filtrage par risque
      if (this.filterRisk !== 'all') {
        stocks = stocks.filter(s => s.riskLevel === this.filterRisk);
      }
      
      // Tri
      const riskOrder = { 'faible': 0, 'moyen': 1, 'elevé': 2, 'sevère': 3 };
      
      stocks.sort((a, b) => {
        switch (this.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'symbol':
            return a.symbol.localeCompare(b.symbol);
          case 'price':
            return (a.price || 0) - (b.price || 0);
          case 'threshold':
            return a.thresholdPrice - b.thresholdPrice;
          case 'risk':
            const aRisk = a.riskLevel || 'moyen';
            const bRisk = b.riskLevel || 'moyen';
            return riskOrder[aRisk] - riskOrder[bRisk];
          default:
            return 0;
        }
      });
      
      return stocks;
    }
  },
  created() {
    this.fetchStocks();
  },
  mounted() {
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
    },
    
    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },
    
    capitalizeRisk(risk) {
      if (!risk) return 'Moyen';
      return risk.charAt(0).toUpperCase() + risk.slice(1);
    }
  }
};
</script>

<style scoped>
.stock-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #2d3748;
  text-align: center;
}

.controls-section {
  margin-bottom: 30px;
}

.last-updated {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #718096;
  flex-wrap: wrap;
  gap: 10px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.refresh-icon {
  font-size: 18px;
}

.filters-stats {
  background-color: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #4a6cf7;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #718096;
}

.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #4a5568;
}

.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  width: 100%;
}

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.stock-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 10px;
}

.stock-title {
  flex: 1;
  min-width: 0;
}

.stock-symbol {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-name {
  font-size: 0.875rem;
  color: #718096;
  margin: 5px 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-shrink: 0;
}

.status-badge, .action-badge, .risk-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-badge.recommended {
  background-color: #4a6cf7;
  color: white;
}

.action-badge.acheter {
  background-color: #c6f6d5;
  color: #2f855a;
}

.action-badge.vendre {
  background-color: #fed7d7;
  color: #e53e3e;
}

.risk-faible {
  background-color: #c6f6d5;
  color: #2f855a;
}

.risk-moyen {
  background-color: #fefcbf;
  color: #d69e2e;
}

.risk-elevé, .risk-eleve {
  background-color: #fed7d7;
  color: #e53e3e;
}

.risk-sevère, .risk-severe {
  background-color: #e53e3e;
  color: white;
}

.stock-body {
  margin-bottom: 15px;
  flex: 1;
}

.price-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.price-item {
  text-align: center;
  flex: 1;
}

.price-label {
  display: block;
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 5px;
}

.price-value {
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.price-value.no-price {
  color: #a0aec0;
}

.stock-footer {
  text-align: center;
  margin-top: auto;
}

.view-btn {
  width: 80%;
  display: inline-block;
  text-align: center;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.view-btn:hover {
  background-color: #3853d8;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4a6cf7;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

/* Responsive */
@media (max-width: 768px) {
  .stock-list {
    padding: 15px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .last-updated {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .refresh-btn {
    justify-content: center;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .stats {
    justify-content: space-around;
  }
  
  .stocks-grid {
    grid-template-columns: 1fr;
  }
  
  .stock-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .stock-badges {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .refresh-text {
    display: none;
  }
  
  .refresh-btn {
    width: auto;
  }
  
  .stats {
    flex-direction: column;
    gap: 15px;
  }
}
</style>