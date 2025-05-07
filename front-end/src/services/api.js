// front-end/src/services/api.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

// Création de l'instance axios avec configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Service pour les seuils d'actions (admin)
export const thresholdService = {
  // Récupérer tous les seuils
  getAllThresholds() {
    return apiClient.get('/thresholds');
  },

  // Récupérer un seuil spécifique
  getThreshold(id) {
    return apiClient.get(`/thresholds/${id}`);
  },

  // Créer un nouveau seuil
  createThreshold(data) {
    return apiClient.post('/thresholds', data);
  },

  // Mettre à jour un seuil
  updateThreshold(id, data) {
    return apiClient.put(`/thresholds/${id}`, data);
  },

  // Supprimer un seuil
  deleteThreshold(id) {
    return apiClient.delete(`/thresholds/${id}`);
  }
};

// Service pour les données d'actions
export const stockService = {
  // Récupérer toutes les actions
  getAllStocks() {
    return apiClient.get('/stocks');
  },

  // Récupérer les actions recommandées
  getRecommendedStocks() {
    return apiClient.get('/stocks/recommended');
  }
};

// front-end/src/services/api.js (ajout à la fin du fichier)

// Service pour la recherche d'actions
export const searchService = {
    // Rechercher des actions par mot-clé avec différents types de recherche
    searchStocks(keyword, searchType = 'general', limit = 20, exchange = '') {
      return apiClient.get('/search', { 
        params: { 
          keyword, 
          type: searchType,
          limit,
          exchange
        } 
      });
    },
    
    // Obtenir les détails d'une action spécifique (prix, variation, etc.)
    getStockDetails(symbol) {
      return apiClient.get(`/search/${symbol}`);
    },
    
    // Obtenir la liste des actions européennes
    getEuropeanStocks() {
      return apiClient.get('/search/market/european');
    }
  };

  // Service pour l'administration
export const adminService = {
  // Obtenir la date de dernière mise à jour des prix
  getLastUpdateTime() {
    return apiClient.get('/admin/last-update');
  },
  
  // Rafraîchir manuellement les données de prix
  refreshStocksData() {
    return apiClient.post('/admin/refresh-stocks');
  }
};