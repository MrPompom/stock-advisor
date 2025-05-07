<!-- front-end/src/views/ThresholdForm.vue -->
<template>
    <div class="threshold-form">
      <h1 class="page-title">{{ isEdit ? 'Modifier' : 'Ajouter' }} une Action</h1>
      
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="loadError" class="error-message">
        <p>{{ loadError }}</p>
        <router-link to="/admin" class="btn btn-primary">Retour à l'administration</router-link>
      </div>
      
      <div v-else class="card">
        <!-- Mode édition: afficher les champs normaux -->
        <form v-if="isEdit" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="symbol">Symbole</label>
            <input 
              type="text" 
              id="symbol" 
              v-model="form.symbol" 
              class="form-control" 
              disabled
            >
            <small class="text-muted">Le symbole ne peut pas être modifié</small>
          </div>
          
          <div class="form-group">
            <label for="name">Nom de l'action</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="form-control"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="thresholdPrice">Seuil de Prix ($)</label>
            <input 
              type="number" 
              id="thresholdPrice" 
              v-model="form.thresholdPrice" 
              class="form-control"
              step="0.01"
              min="0"
              required
            >
            <small class="text-muted">L'action sera recommandée si son prix actuel est inférieur ou égal à ce seuil</small>
          </div>
          
          <div class="form-group">
            <label for="isActive">Statut</label>
            <div class="checkbox-wrapper">
              <input 
                type="checkbox" 
                id="isActive" 
                v-model="form.isActive"
              >
              <label for="isActive" class="checkbox-label">Action active</label>
            </div>
            <small class="text-muted">Désactivez pour masquer cette action sans la supprimer</small>
          </div>
          
          <div v-if="formError" class="error-message mb-4">
            {{ formError }}
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Traitement...' : 'Mettre à jour' }}
            </button>
            <router-link to="/admin" class="btn btn-secondary">Annuler</router-link>
          </div>
        </form>
        
        <!-- Mode création: afficher l'interface de recherche d'abord -->
        <div v-else>
          <!-- Étape 1: Recherche d'actions -->
          <div v-if="currentStep === 1">
            <div class="form-group">
              <label for="searchKeyword">Rechercher une action</label>
              
              <!-- Options de recherche -->
              <div class="search-options">
                <div class="search-type">
                  <label>Type de recherche :</label>
                  <div class="search-type-buttons">
                    <button 
                      type="button" 
                      class="btn btn-sm" 
                      :class="searchType === 'general' ? 'btn-primary' : 'btn-outline-primary'"
                      @click="searchType = 'general'"
                    >
                      Général
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm" 
                      :class="searchType === 'symbol' ? 'btn-primary' : 'btn-outline-primary'"
                      @click="searchType = 'symbol'"
                    >
                      Symbole
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm" 
                      :class="searchType === 'name' ? 'btn-primary' : 'btn-outline-primary'"
                      @click="searchType = 'name'"
                    >
                      Nom d'entreprise
                    </button>
                  </div>
                </div>
                
                <!-- Filtrage optionnel par bourse -->
                <div class="search-exchange">
                  <label for="searchExchange">Bourse (optionnel) :</label>
                  <select id="searchExchange" v-model="searchExchange" class="form-control form-control-sm">
                    <option value="">Toutes les bourses</option>
                    <option value="EURONEXT">Euronext</option>
                    <option value="XETRA">XETRA (Allemagne)</option>
                    <option value="LSE">London Stock Exchange</option>
                    <option value="NASDAQ">NASDAQ</option>
                    <option value="NYSE">NYSE</option>
                  </select>
                </div>
              </div>
              
              <!-- Champ de recherche -->
              <div class="search-input-group">
                <input 
                  type="text" 
                  id="searchKeyword" 
                  v-model="searchKeyword" 
                  class="form-control"
                  :placeholder="getSearchPlaceholder()"
                  @keyup.enter="searchStocks"
                >
                <button 
                  type="button" 
                  class="btn btn-primary search-btn" 
                  @click="searchStocks"
                  :disabled="isSearching || !searchKeyword"
                >
                  {{ isSearching ? 'Recherche...' : 'Rechercher' }}
                </button>
              </div>
              
              <!-- Indication du type de recherche -->
              <small class="search-type-desc">
                {{ getSearchTypeDescription() }}
              </small>
            </div>
            
            <div v-if="searchError" class="error-message mb-4">
              {{ searchError }}
            </div>
            
            <div v-if="isSearching" class="loading-mini">
              <div class="loading-spinner-mini"></div>
              <span>Recherche en cours...</span>
            </div>
            
            <div v-else-if="searchResults.length > 0" class="search-results">
              <h3 class="results-title">Résultats de recherche</h3>
              <div class="stock-results-list">
                <div 
                  v-for="stock in searchResults" 
                  :key="stock.symbol"
                  class="stock-result-item"
                  @click="selectStock(stock)"
                >
                  <div class="stock-result-info">
                    <div class="stock-result-symbol">{{ stock.symbol }}</div>
                    <div class="stock-result-name">{{ stock.name }}</div>
                  </div>
                  <div class="stock-result-meta">
                    <span class="stock-result-exchange">{{ stock.exchange }}</span>
                    <span class="stock-result-currency" v-if="stock.currency">{{ stock.currency }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="hasSearched" class="no-results">
              <p>Aucune action trouvée pour "{{ searchKeyword }}".</p>
              <p>Essayez avec un autre terme ou utilisez le formulaire manuel.</p>
            </div>
            
            <!-- Ajout d'un bouton pour explorer les actions européennes -->
            <div class="market-selector">
              <p>Vous pouvez également explorer directement les marchés :</p>
              <button 
                type="button" 
                class="btn btn-secondary market-btn" 
                @click="loadEuropeanStocks"
                :disabled="isLoadingEuropean"
              >
                {{ isLoadingEuropean ? 'Chargement...' : 'Actions Européennes' }}
              </button>
            </div>
            
            <!-- Affichage des résultats européens -->
            <div v-if="isLoadingEuropean" class="loading-mini">
              <div class="loading-spinner-mini"></div>
              <span>Chargement des actions européennes...</span>
            </div>
            
            <div v-else-if="europeanStocks.length > 0" class="search-results">
              <h3 class="results-title">Actions Européennes</h3>
              <div class="stock-results-list">
                <div 
                  v-for="stock in europeanStocks" 
                  :key="stock.symbol"
                  class="stock-result-item"
                  @click="selectStock(stock)"
                >
                  <div class="stock-result-info">
                    <div class="stock-result-symbol">{{ stock.symbol }}</div>
                    <div class="stock-result-name">{{ stock.name || 'N/A' }}</div>
                  </div>
                  <div class="stock-result-meta">
                    <span class="stock-result-exchange">{{ stock.exchange }}</span>
                    <span class="stock-result-price" v-if="stock.price">{{ stock.price }} {{ stock.currency }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-actions mt-4">
              <button 
                type="button" 
                class="btn btn-secondary"
                @click="currentStep = 2"
              >
                Saisie manuelle
              </button>
              <router-link to="/admin" class="btn btn-link">Annuler</router-link>
            </div>
          </div>
          
          <!-- Étape 2: Définition du seuil pour l'action sélectionnée ou saisie manuelle -->
          <form v-else @submit.prevent="submitForm">
            <!-- Affichage du prix actuel et des variations si disponibles -->
            <div v-if="stockDetails" class="stock-details-panel">
              <div class="stock-detail-header">
                <h3>{{ stockDetails.symbol }}</h3>
                <div class="stock-price-large">{{ formatPrice(stockDetails.price) }}$</div>
              </div>
              <div class="stock-detail-changes">
                <div class="stock-change" :class="getChangeClass(stockDetails.change)">
                  <span class="change-arrow">{{ stockDetails.change >= 0 ? '↑' : '↓' }}</span>
                  <span class="change-value">{{ formatPrice(Math.abs(stockDetails.change)) }}$</span>
                  <span class="change-percent">({{ stockDetails.changePercent }}%)</span>
                </div>
                <div class="stock-volume">
                  Volume: {{ formatNumber(stockDetails.volume) }}
                </div>
                <div class="stock-update-time">
                  Dernière mise à jour: {{ formatDate(stockDetails.lastUpdated) }}
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="symbol">Symbole</label>
              <input 
                type="text" 
                id="symbol" 
                v-model="form.symbol" 
                class="form-control" 
                placeholder="Ex: AAPL, MSFT, GOOGL"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="name">Nom de l'action</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                class="form-control"
                placeholder="Ex: Apple Inc., Microsoft Corporation"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="thresholdPrice">Seuil de Prix ($)</label>
              <input 
                type="number" 
                id="thresholdPrice" 
                v-model="form.thresholdPrice" 
                class="form-control"
                step="0.01"
                min="0"
                placeholder="Ex: 150.00"
                required
              >
              <small class="text-muted">L'action sera recommandée si son prix actuel est inférieur ou égal à ce seuil</small>
            </div>
            
            <div v-if="formError" class="error-message mb-4">
              {{ formError }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Traitement...' : 'Ajouter' }}
              </button>
              <button 
                v-if="!isEdit" 
                type="button" 
                class="btn btn-secondary"
                @click="currentStep = 1"
              >
                Retour à la recherche
              </button>
              <router-link v-else to="/admin" class="btn btn-secondary">Annuler</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  import { searchService } from '@/services/api';
  
  export default {
    name: 'ThresholdForm',
    props: {
      id: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        form: {
          symbol: '',
          name: '',
          thresholdPrice: '',
          isActive: true
        },
        currentStep: 1, // 1: Recherche, 2: Formulaire
        searchKeyword: '',
        searchType: 'general', // 'general', 'symbol', ou 'name'
        searchExchange: '',
        searchResults: [],
        hasSearched: false,
        isSearching: false,
        searchError: null,
        isSubmitting: false,
        formError: null,
        loadError: null,
        stockDetails: null, // Pour stocker les détails du prix et des variations
        isLoadingDetails: false, // Pour gérer l'état de chargement des détails
        europeanStocks: [],
        isLoadingEuropean: false
      };
    },
    computed: {
      ...mapGetters(['allThresholds', 'isLoading']),
      isEdit() {
        return !!this.id;
      }
    },
    created() {
      if (this.isEdit) {
        this.loadThreshold();
        this.currentStep = 2; // En mode édition, aller directement au formulaire
      }
    },
    methods: {
      ...mapActions(['fetchThresholds', 'createThreshold', 'updateThreshold']),
      
      formatPrice(price) {
        return parseFloat(price).toFixed(2);
      },
      
      formatNumber(num) {
        return new Intl.NumberFormat().format(num);
      },
      
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
      },
      
      getChangeClass(change) {
        return change >= 0 ? 'positive' : 'negative';
      },
      
      // Obtenir un placeholder adapté au type de recherche
      getSearchPlaceholder() {
        switch (this.searchType) {
          case 'symbol':
            return 'Entrez un symbole boursier (ex: AAPL, MC.PA)';
          case 'name':
            return 'Entrez un nom d\'entreprise (ex: Apple, LVMH)';
          default:
            return 'Entrez un nom ou symbole d\'action';
        }
      },
      
      // Obtenir une description du type de recherche actuel
      getSearchTypeDescription() {
        switch (this.searchType) {
          case 'symbol':
            return 'Recherche par symbole boursier (plus précise pour les tickers exacts)';
          case 'name':
            return 'Recherche par nom d\'entreprise (meilleure pour les noms partiels)';
          default:
            return 'Recherche générale (combine symbole et nom)';
        }
      },
      
      async loadThreshold() {
        try {
          // S'assurer que les seuils sont chargés
          if (this.allThresholds.length === 0) {
            await this.fetchThresholds();
          }
          
          const threshold = this.allThresholds.find(t => t._id === this.id);
          
          if (!threshold) {
            this.loadError = 'Seuil non trouvé';
            return;
          }
          
          // Remplir le formulaire avec les données du seuil
          this.form = {
            symbol: threshold.symbol,
            name: threshold.name,
            thresholdPrice: threshold.thresholdPrice,
            isActive: threshold.isActive
          };
          
          // Charger les détails du prix actuel pour cette action
          this.fetchStockDetails(threshold.symbol);
        } catch (error) {
          this.loadError = 'Erreur lors du chargement du seuil';
          console.error('Error loading threshold:', error);
        }
      },
      
      async searchStocks() {
        if (!this.searchKeyword || this.searchKeyword.trim().length < 1) {
          this.searchError = 'Veuillez entrer un terme de recherche';
          return;
        }
        
        this.searchError = null;
        this.isSearching = true;
        this.hasSearched = true;
        
        try {
          const response = await searchService.searchStocks(
            this.searchKeyword,
            this.searchType,
            20,
            this.searchExchange
          );
          this.searchResults = response.data;
        } catch (error) {
          this.searchError = error.response?.data?.message || 'Erreur lors de la recherche';
          console.error('Search error:', error);
        } finally {
          this.isSearching = false;
        }
      },
      
      async fetchStockDetails(symbol) {
        this.isLoadingDetails = true;
        
        try {
          const response = await searchService.getStockDetails(symbol);
          this.stockDetails = response.data;
          
          // Pré-remplir le seuil de prix avec le prix actuel si c'est un nouvel ajout
          if (!this.isEdit && !this.form.thresholdPrice) {
            this.form.thresholdPrice = this.stockDetails.price;
          }
        } catch (error) {
          console.error('Error fetching stock details:', error);
          // Ne pas afficher d'erreur pour ne pas perturber l'expérience utilisateur
        } finally {
          this.isLoadingDetails = false;
        }
      },
      
      async loadEuropeanStocks() {
        this.isLoadingEuropean = true;
        
        try {
          const response = await searchService.getEuropeanStocks();
          // Limiter à 100 résultats pour des raisons de performance
          this.europeanStocks = response.data.slice(0, 100);
        } catch (error) {
          console.error('Error loading European stocks:', error);
          this.searchError = 'Erreur lors du chargement des actions européennes';
        } finally {
          this.isLoadingEuropean = false;
        }
      },
      
      async selectStock(stock) {
        // Remplir le formulaire avec les données de l'action sélectionnée
        this.form.symbol = stock.symbol;
        this.form.name = stock.name;
        
        // Récupérer les détails du prix et des variations
        await this.fetchStockDetails(stock.symbol);
        
        // Passer à l'étape du formulaire
        this.currentStep = 2;
      },
      
      async submitForm() {
        this.formError = null;
        this.isSubmitting = true;
        
        try {
          if (this.isEdit) {
            await this.updateThreshold({
              id: this.id,
              data: {
                name: this.form.name,
                thresholdPrice: parseFloat(this.form.thresholdPrice),
                isActive: this.form.isActive
              }
            });
          } else {
            await this.createThreshold({
              symbol: this.form.symbol.toUpperCase(),
              name: this.form.name,
              thresholdPrice: parseFloat(this.form.thresholdPrice)
            });
          }
          
          // Rediriger vers la page d'administration
          this.$router.push('/admin');
        } catch (error) {
          this.formError = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
          console.error('Form submission error:', error);
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .threshold-form {
    padding: 20px 0;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 30px;
    color: #2d3748;
  }
  
  .text-muted {
    color: #718096;
    font-size: 0.85rem;
  }
  
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .checkbox-label {
    margin-left: 10px;
    font-weight: normal;
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
  }
  
  .mt-4 {
    margin-top: 20px;
  }
  
  .error-message {
    padding: 15px;
    background-color: #fff5f5;
    border-radius: 4px;
    color: #c53030;
    margin-bottom: 15px;
  }
  
  .search-input-group {
    display: flex;
    gap: 10px;
  }
  
  .search-btn {
    flex-shrink: 0;
  }
  
  .loading-mini {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
  }
  
  .loading-spinner-mini {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4a6cf7;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }
  
  .results-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 20px 0 15px 0;
    color: #2d3748;
  }
  
  .stock-results-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .stock-result-item {
    padding: 15px;
    border-bottom: 1px solid #e2e8f0;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stock-result-item:last-child {
    border-bottom: none;
  }
  
  .stock-result-item:hover {
    background-color: #f7fafc;
  }
  
  .stock-result-symbol {
    font-weight: 600;
    font-size: 1.1rem;
    color: #2d3748;
  }
  
  .stock-result-name {
    color: #718096;
  }
  
  .stock-result-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .stock-result-exchange {
    font-size: 0.8rem;
    color: #718096;
    padding: 2px 6px;
    background-color: #edf2f7;
    border-radius: 4px;
    margin-bottom: 4px;
  }
  
  .stock-result-currency, .stock-result-price {
    font-size: 0.85rem;
    color: #718096;
  }
  
  .stock-result-price {
    font-weight: 600;
    color: #4a6cf7;
  }
  
  .no-results {
    padding: 20px;
    text-align: center;
    background-color: #f9fafb;
    border-radius: 4px;
    margin: 20px 0;
    color: #718096;
  }
  
  .search-options {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .search-type, .search-exchange {
    flex: 1;
    min-width: 250px;
  }
  
  .search-type-buttons {
    display: flex;
    gap: 5px;
    margin-top: 5px;
  }
  
  .search-type-desc {
    display: block;
    color: #718096;
    margin-top: 5px;
    font-style: italic;
  }
  
  .form-control-sm {
    height: calc(1.5em + 0.5rem + 2px);
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
  }
  
  .btn-outline-primary {
    color: #4a6cf7;
    background-color: transparent;
    border: 1px solid #4a6cf7;
  }
  
  .btn-outline-primary:hover {
    color: white;
    background-color: #4a6cf7;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
  }
  
  .market-selector {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8fafc;
    border-radius: 8px;
    text-align: center;
  }
  
  .market-btn {
    margin-top: 10px;
  }
  
  /* Styles pour l'affichage des détails de l'action */
  .stock-details-panel {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
    border-left: 4px solid #4a6cf7;
  }
  
  .stock-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .stock-detail-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #2d3748;
  }
  
  .stock-price-large {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2d3748;
  }
  
  .stock-detail-changes {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .stock-change {
    display: flex;
    align-items: center;
    font-weight: 600;
    gap: 5px;
  }
  
  .positive {
    color: #38a169;
  }
  
  .negative {
    color: #e53e3e;
  }
  
  .change-arrow {
    font-size: 1.2rem;
  }
  
  .stock-volume, .stock-update-time {
    color: #718096;
    font-size: 0.9rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  </style>