// back-end/src/services/alphaVantageService.js
const axios = require('axios');
const logger = require('../utils/logger');

// Configuration pour Alpha Vantage
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'votre_clé_api';
const BASE_URL = 'https://www.alphavantage.co/query';

// Délai entre les requêtes pour respecter les limites (max 5 requêtes par minute / 500 par jour)
const API_DELAY = 1200; // 12 secondes entre chaque requête

/**
 * Fonction utilitaire pour attendre
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Récupère les données d'une action spécifique
 */
const getStockData = async (symbol) => {
  console.log(`Alpha Vantage: Récupération des données pour ${symbol}`);
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });

    console.log(`Réponse reçue pour ${symbol}:`, JSON.stringify(response.data));

    if (response.data['Error Message']) {
      throw new Error(`API error: ${response.data['Error Message']}`);
    }

    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid API response format');
    }

    const stockData = {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      lastUpdated: new Date()
    };

    console.log(`Données formatées pour ${symbol}:`, JSON.stringify(stockData));
    return stockData;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
    logger.error(`Error fetching stock data for ${symbol}: ${error.message}`);
    throw error;
  }
};

/**
 * Met à jour les données pour toutes les actions dans la base de données
 */
const updateAllStocksData = async (StockThreshold) => {
  console.log('=== DÉBUT updateAllStocksData ===');
  try {
    // Récupérer tous les seuils d'actions actifs
    const thresholds = await StockThreshold.find({ isActive: true });
    
    console.log(`Trouvé ${thresholds.length} actions à mettre à jour`);
    
    // Compteur pour les mises à jour réussies
    let successCount = 0;
    let errors = [];
    
    // Traiter chaque action séquentiellement avec un délai
    for (const threshold of thresholds) {
      console.log(`Traitement de l'action ${threshold.symbol} (${successCount + 1}/${thresholds.length})`);
      
      try {
        // Attendre entre chaque requête pour respecter les limites
        if (successCount > 0) {
          console.log(`Attente de ${API_DELAY}ms avant la prochaine requête...`);
          await sleep(API_DELAY);
        }
        
        // Récupérer les données actuelles
        console.log(`Appel API pour ${threshold.symbol}...`);
        const stockData = await getStockData(threshold.symbol);
        
        // Mettre à jour dans la base de données
        console.log(`Mise à jour dans la base de données pour ${threshold.symbol}`);
        threshold.currentPrice = stockData.price;
        threshold.change = stockData.change;
        threshold.changePercent = stockData.changePercent;
        threshold.volume = stockData.volume;
        threshold.lastUpdated = stockData.lastUpdated;
        
        await threshold.save();
        
        successCount++;
        console.log(`${threshold.symbol} mise à jour avec succès !`);
      } catch (error) {
        console.error(`Échec de la mise à jour pour ${threshold.symbol}:`, error);
        errors.push({
          symbol: threshold.symbol,
          error: error.message
        });
        // Continuer avec le symbole suivant en cas d'erreur
      }
    }
    
    console.log(`Mise à jour terminée: ${successCount}/${thresholds.length} actions mises à jour`);
    if (errors.length > 0) {
      console.log(`${errors.length} erreurs rencontrées:`, JSON.stringify(errors));
    }
    
    console.log('=== FIN updateAllStocksData ===');
    
    return {
      total: thresholds.length,
      success: successCount,
      errors: errors,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('ERREUR GLOBALE dans updateAllStocksData:', error);
    logger.error(`Error in batch update: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getStockData,
  updateAllStocksData
};