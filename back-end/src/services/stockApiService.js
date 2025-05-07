// back-end/src/services/stockApiService.js
const axios = require('axios');
const logger = require('../utils/logger');

// Configuration pour Financial Modeling Prep
const API_KEY = process.env.FMP_API_KEY || '4dbhZDZo4wWZw7eJTAyZkdYRL8t9ndvW'; // Utilisation de la clé de démo par défaut
const BASE_URL = 'https://financialmodelingprep.com/api/v3';
const STABLE_URL = 'https://financialmodelingprep.com/stable';

// Délai entre les requêtes API pour éviter de dépasser les limites
const API_DELAY = 250; // millisecondes

/**
 * Fonction utilitaire pour attendre un certain temps
 * @param {number} ms - Temps d'attente en millisecondes
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Construction de l'URL avec la clé API selon les règles de FMP
 * @param {string} endpoint - Endpoint de l'API
 * @param {Object} params - Paramètres additionnels (optionnel)
 * @param {string} baseUrl - URL de base (optionnel)
 * @returns {string} - URL complète
 */
const buildUrl = (endpoint, params = {}, baseUrl = BASE_URL) => {
  let url = `${baseUrl}/${endpoint}`;
  
  // Convertir les paramètres en chaîne de requête
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  // Ajouter les paramètres à l'URL
  if (queryParams) {
    url += `?${queryParams}&apikey=${API_KEY}`;
  } else {
    url += `?apikey=${API_KEY}`;
  }
  
  return url;
};

/**
 * Récupère les données d'une action spécifique
 * @param {string} symbol - Symbole de l'action (ex: MC.PA pour LVMH sur Euronext Paris)
 * @returns {Promise<Object>} - Données de l'action
 */
const getStockData = async (symbol) => {
  try {
    // Ajouter un délai pour éviter de dépasser les limites de l'API
    await sleep(API_DELAY);
    
    const url = buildUrl(`quote/${symbol}`);
    const response = await axios.get(url);

    if (!response.data || response.data.length === 0) {
      throw new Error('Invalid API response format or no data available');
    }

    const quote = response.data[0];
    
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changesPercentage,
      volume: quote.volume,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Error fetching stock data for ${symbol}: ${error.message}`);
    throw error;
  }
};

/**
 * Version modifiée qui ne dépend plus de l'endpoint batch qui pourrait être limité
 * @param {Array<string>} symbols - Liste des symboles d'actions
 * @returns {Promise<Array<Object>>} - Données des actions
 */
const getBatchStockData = async (symbols) => {
  try {
    if (symbols.length === 0) {
      return [];
    }
    
    // Approche séquentielle avec des délais pour éviter les limites d'API
    const results = [];
    for (const symbol of symbols) {
      try {
        // Ajouter un délai entre chaque requête
        await sleep(API_DELAY);
        
        const stockData = await getStockData(symbol);
        results.push(stockData);
      } catch (error) {
        logger.error(`Error fetching data for ${symbol}: ${error.message}`);
        // Continuer avec le symbole suivant en cas d'erreur
      }
    }
    
    return results;
  } catch (error) {
    logger.error(`Error in batch stock data processing: ${error.message}`);
    throw error;
  }
};

/**
 * Recherche des actions par mot-clé (nom ou symbole)
 * @param {string} keyword - Mot-clé de recherche
 * @param {string} searchType - Type de recherche ('symbol', 'name', ou 'general')
 * @param {number} limit - Nombre maximum de résultats (optionnel)
 * @param {string} exchange - Bourse spécifique à filtrer (optionnel)
 * @returns {Promise<Array<Object>>} - Liste des actions correspondantes
 */
// Dans le fichier back-end/src/services/stockApiService.js
const searchStocks = async (keyword, searchType = 'general', limit = 20, exchange = '') => {
    console.log('=== DÉBUT searchStocks ===');
    console.log(`Paramètres: keyword='${keyword}', type='${searchType}', limit=${limit}, exchange='${exchange}'`);
    
    try {
      let url;
      const params = { query: keyword };
      
      // Ajouter les paramètres optionnels s'ils sont fournis
      if (limit) params.limit = limit;
      if (exchange) params.exchange = exchange;
      
      switch (searchType) {
        case 'symbol':
          // Recherche par symbole (ticker)
          url = buildUrl('search-symbol', params, STABLE_URL);
          console.log(`Mode recherche par symbole: URL=${url}`);
          break;
        case 'name':
          // Recherche par nom d'entreprise
          url = buildUrl('search-name', params, STABLE_URL);
          console.log(`Mode recherche par nom: URL=${url}`);
          break;
        default:
          // Recherche générale (utilise l'ancien endpoint pour compatibilité)
          url = buildUrl('search', { query: keyword, limit }, BASE_URL);
          console.log(`Mode recherche générale: URL=${url}`);
          break;
      }
      
      console.log('Début de la requête API...');
      const response = await axios.get(url);
      console.log('Réponse API reçue');
      console.log('Status de la réponse:', response.status);
      console.log('Headers:', JSON.stringify(response.headers));
      
      if (!response.data) {
        console.log('WARNING: response.data est null ou undefined');
        throw new Error('Invalid API response format');
      }
      
      console.log(`Nombre de résultats: ${response.data.length}`);
      if (response.data.length > 0) {
        console.log('Premier résultat:', JSON.stringify(response.data[0]));
        console.log('Structure de données:', Object.keys(response.data[0]).join(', '));
      }
  
      // Formater les résultats de manière cohérente, quelle que soit la méthode de recherche
      const formattedResults = response.data.map(result => {
        const formattedItem = {
          symbol: result.symbol,
          name: result.name,
          type: result.type || 'Equity',
          exchange: result.exchange || result.exchangeShortName || 'Unknown',
          exchangeFullName: result.exchangeFullName || '',
          currency: result.currency || 'Unknown',
          matchScore: 1.0 // FMP ne fournit pas de score de correspondance
        };
        console.log(`Résultat formaté pour ${result.symbol}:`, JSON.stringify(formattedItem));
        return formattedItem;
      });
      
      console.log(`Total de ${formattedResults.length} résultats formatés`);
      console.log('=== FIN searchStocks ===');
      
      return formattedResults;
    } catch (error) {
      console.error('ERREUR dans searchStocks:', error);
      if (error.response) {
        console.error(`Status: ${error.response.status}, StatusText: ${error.response.statusText}`);
        console.error('Error Headers:', JSON.stringify(error.response.headers));
        console.error('Error Data:', JSON.stringify(error.response.data));
      }
      console.error('Stack trace:', error.stack);
      
      logger.error(`Error searching stocks with ${searchType} method: ${error.message}`);
      throw error;
    }
  };

/**
 * Récupère la liste des actions disponibles sur les bourses européennes (Euronext)
 * @returns {Promise<Array<Object>>} - Liste des actions européennes
 */
const getEuropeanStocks = async () => {
  try {
    // Essayer d'abord avec l'endpoint spécifique à Euronext
    const url = buildUrl('symbol/available-euronext');
    const response = await axios.get(url);

    if (!response.data) {
      throw new Error('Invalid API response format');
    }

    return response.data;
  } catch (error) {
    // En cas d'erreur (peut-être un endpoint premium), essayer avec l'approche par recherche
    try {
      logger.info('Falling back to stock list for European stocks');
      const allStocksUrl = buildUrl('stock/list');
      const allStocksResponse = await axios.get(allStocksUrl);

      if (!allStocksResponse.data) {
        throw new Error('Invalid API response format');
      }

      // Filtrer pour les bourses européennes (Euronext, XETRA, LSE, etc.)
      const europeanExchanges = ['Paris', 'Amsterdam', 'Brussels', 'Lisbon', 'XETRA', 'LSE'];
      return allStocksResponse.data.filter(stock => 
        europeanExchanges.some(exchange => 
          stock.exchange && stock.exchange.includes(exchange)
        )
      );
    } catch (secondError) {
      logger.error(`Error fetching European stocks: ${secondError.message}`);
      throw secondError;
    }
  }
};

module.exports = {
  getStockData,
  getBatchStockData,
  searchStocks,
  getEuropeanStocks
};