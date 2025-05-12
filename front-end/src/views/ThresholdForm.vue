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
        
        <!-- Nouveau champ pour le type d'action -->
        <div class="form-group">
          <label>Type d'action</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                value="acheter" 
                v-model="form.actionType"
              >
              <span>Acheter</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                value="vendre" 
                v-model="form.actionType"
              >
              <span>Vendre</span>
            </label>
          </div>
          <small class="text-muted">
            {{ form.actionType === 'acheter' 
              ? 'L\'action sera recommandée à l\'achat si son prix est inférieur ou égal au seuil' 
              : 'L\'action sera recommandée à la vente si son prix est supérieur ou égal au seuil' 
            }}
          </small>
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
        </div>
        
        <!-- Nouveau champ pour l'indice de risque -->
        <div class="form-group">
          <label for="riskLevel">Indice de risque</label>
          <select 
            id="riskLevel" 
            v-model="form.riskLevel" 
            class="form-control"
            required
          >
            <option value="faible">Faible</option>
            <option value="moyen">Moyen</option>
            <option value="elevé">Élevé</option>
            <option value="sevère">Sévère</option>
          </select>
          <small class="text-muted">Niveau de risque associé à cette action</small>
        </div>
        
        <div class="form-group">
          <label for="url">URL de la valeur</label>
          <input 
            type="url" 
            id="url" 
            v-model="form.url" 
            class="form-control"
            placeholder="https://www.example.com/stock/symbol"
            required
          >
          <small class="text-muted">URL de la page où trouver le prix de l'action</small>
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
          
          <!-- Nouveau champ pour le type d'action -->
          <div class="form-group">
            <label>Type d'action</label>
            <div class="radio-group">
              <label class="radio-label">
                <input 
                  type="radio" 
                  value="acheter" 
                  v-model="form.actionType"
                >
                <span>Acheter</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  value="vendre" 
                  v-model="form.actionType"
                >
                <span>Vendre</span>
              </label>
            </div>
            <small class="text-muted">
              {{ form.actionType === 'acheter' 
                ? 'L\'action sera recommandée à l\'achat si son prix est inférieur ou égal au seuil' 
                : 'L\'action sera recommandée à la vente si son prix est supérieur ou égal au seuil' 
              }}
            </small>
          </div>
          
          <div class="form-group">
            <label for="thresholdPrice">Seuil de Prix (€)</label>
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
          </div>
          
          <!-- Nouveau champ pour l'indice de risque -->
          <div class="form-group">
            <label for="riskLevel">Indice de risque</label>
            <select 
              id="riskLevel" 
              v-model="form.riskLevel" 
              class="form-control"
              required
            >
              <option value="faible">Faible</option>
              <option value="moyen">Moyen</option>
              <option value="elevé">Élevé</option>
              <option value="sevère">Sévère</option>
            </select>
            <small class="text-muted">Niveau de risque associé à cette action</small>
          </div>
          
          <div class="form-group">
            <label for="url">URL de la valeur</label>
            <input 
              type="url" 
              id="url" 
              v-model="form.url" 
              class="form-control"
              placeholder="https://www.boursorama.com/cours/1rPAAPL/"
              pattern="https?://.+"
              required
            >
            <small class="text-muted">URL de la page où trouver le prix de l'action</small>
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
        url: '',
        isActive: true,
        riskLevel: 'moyen', // Nouveau champ
        actionType: 'acheter' // Nouveau champ
      },
      currentStep: 1,
      searchKeyword: '',
      searchType: 'general',
      searchExchange: '',
      searchResults: [],
      hasSearched: false,
      isSearching: false,
      searchError: null,
      isSubmitting: false,
      formError: null,
      loadError: null,
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
      this.currentStep = 2;
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
        if (this.allThresholds.length === 0) {
          await this.fetchThresholds();
        }
        
        const threshold = this.allThresholds.find(t => t._id === this.id);
        
        if (!threshold) {
          this.loadError = 'Seuil non trouvé';
          return;
        }
        
        this.form = {
          symbol: threshold.symbol,
          name: threshold.name,
          thresholdPrice: threshold.thresholdPrice,
          url: threshold.url || '',
          isActive: threshold.isActive,
          riskLevel: threshold.riskLevel || 'moyen', // Nouveau
          actionType: threshold.actionType || 'acheter' // Nouveau
        };
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
    
    async loadEuropeanStocks() {
      this.isLoadingEuropean = true;
      
      try {
        const response = await searchService.getEuropeanStocks();
        this.europeanStocks = response.data.slice(0, 100);
      } catch (error) {
        console.error('Error loading European stocks:', error);
        this.searchError = 'Erreur lors du chargement des actions européennes';
      } finally {
        this.isLoadingEuropean = false;
      }
    },
    
    async selectStock(stock) {
      this.form.symbol = stock.symbol;
      this.form.name = stock.name;
      this.form.url = `https://www.boursorama.com/cours/${stock.symbol}/`;
      
      this.currentStep = 2;
    },
    
    validateUrl(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    
    async submitForm() {
      this.formError = null;
      
      if (!this.validateUrl(this.form.url)) {
        this.formError = 'URL invalide. Veuillez entrer une URL complète (ex: https://www.example.com)';
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        if (this.isEdit) {
          await this.updateThreshold({
            id: this.id,
            data: {
              name: this.form.name,
              thresholdPrice: parseFloat(this.form.thresholdPrice),
              url: this.form.url,
              isActive: this.form.isActive,
              riskLevel: this.form.riskLevel, // Nouveau
              actionType: this.form.actionType // Nouveau
            }
          });
        } else {
          await this.createThreshold({
            symbol: this.form.symbol.toUpperCase(),
            name: this.form.name,
            thresholdPrice: parseFloat(this.form.thresholdPrice),
            url: this.form.url,
            isActive: this.form.isActive,
            riskLevel: this.form.riskLevel, // Nouveau
            actionType: this.form.actionType // Nouveau
          });
        }
        
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
/* Styles identiques au code précédent, mais sans les styles pour stock-details-panel */
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

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  margin-right: 8px;
}

.radio-label span {
  font-weight: normal;
}

/* ... reste des styles sans les styles pour stock-details-panel ... */
</style>