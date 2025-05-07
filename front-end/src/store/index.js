// front-end/src/store/index.js
import { createStore } from 'vuex';
import { stockService, thresholdService } from '@/services/api';

export default createStore({
  state: {
    stocks: [],
    recommendedStocks: [],
    thresholds: [],
    loading: false,
    error: null,
    lastUpdated: null
  },

  getters: {
    // Obtenir toutes les actions
    allStocks: (state) => state.stocks,
    
    // Obtenir les actions recommandées
    recommendedStocks: (state) => state.recommendedStocks,
    
    // Obtenir tous les seuils
    allThresholds: (state) => state.thresholds,
    
    // État de chargement
    isLoading: (state) => state.loading,
    
    // Erreur
    error: (state) => state.error,
    
    // Dernière mise à jour
    lastUpdated: (state) => state.lastUpdated ? new Date(state.lastUpdated).toLocaleString() : 'Jamais'
  },

  mutations: {
    // Définir toutes les actions
    SET_STOCKS(state, stocks) {
      state.stocks = stocks;
      state.lastUpdated = new Date().toISOString();
    },
    
    // Définir les actions recommandées
    SET_RECOMMENDED_STOCKS(state, stocks) {
      state.recommendedStocks = stocks;
    },
    
    // Définir tous les seuils
    SET_THRESHOLDS(state, thresholds) {
      state.thresholds = thresholds;
    },
    
    // Ajouter un seuil
    ADD_THRESHOLD(state, threshold) {
      state.thresholds.push(threshold);
    },
    
    // Mettre à jour un seuil
    UPDATE_THRESHOLD(state, updatedThreshold) {
      const index = state.thresholds.findIndex(t => t._id === updatedThreshold._id);
      if (index !== -1) {
        state.thresholds.splice(index, 1, updatedThreshold);
      }
    },
    
    // Supprimer un seuil
    DELETE_THRESHOLD(state, id) {
      state.thresholds = state.thresholds.filter(t => t._id !== id);
    },
    
    // Définir l'état de chargement
    SET_LOADING(state, status) {
      state.loading = status;
    },
    
    // Définir une erreur
    SET_ERROR(state, error) {
      state.error = error;
    },
    
    // Effacer une erreur
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },

  actions: {
    // Charger toutes les actions
    async fetchStocks({ commit }) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      try {
        const response = await stockService.getAllStocks();
        commit('SET_STOCKS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du chargement des actions');
        console.error('Error fetching stocks:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Charger les actions recommandées
    async fetchRecommendedStocks({ commit }) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      try {
        const response = await stockService.getRecommendedStocks();
        commit('SET_RECOMMENDED_STOCKS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du chargement des actions recommandées');
        console.error('Error fetching recommended stocks:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Charger tous les seuils
    async fetchThresholds({ commit }) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      try {
        const response = await thresholdService.getAllThresholds();
        commit('SET_THRESHOLDS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du chargement des seuils');
        console.error('Error fetching thresholds:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Créer un nouveau seuil
    async createThreshold({ commit }, thresholdData) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      try {
        const response = await thresholdService.createThreshold(thresholdData);
        commit('ADD_THRESHOLD', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la création du seuil');
        console.error('Error creating threshold:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Mettre à jour un seuil
    async updateThreshold({ commit }, { id, data }) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      try {
        const response = await thresholdService.updateThreshold(id, data);
        commit('UPDATE_THRESHOLD', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la mise à jour du seuil');
        console.error('Error updating threshold:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Supprimer un seuil
    async deleteThreshold({ commit }, id) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      try {
        await thresholdService.deleteThreshold(id);
        commit('DELETE_THRESHOLD', id);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la suppression du seuil');
        console.error('Error deleting threshold:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
});