// back-end/src/controllers/stockSearchController.js
const stockApiService = require('../services/stockApiService');
const logger = require('../utils/logger');

// Rechercher des actions par mot-clé
// Dans le fichier back-end/src/controllers/stockSearchController.js
exports.searchStocks = async (req, res) => {
    console.log('=== DÉBUT du contrôleur searchStocks ===');
    console.log('Paramètres de la requête:', req.query);
    
    try {
      const { keyword, type = 'general', limit = 20, exchange = '' } = req.query;
      console.log(`Paramètres extraits: keyword='${keyword}', type='${type}', limit=${limit}, exchange='${exchange}'`);
      
      if (!keyword || keyword.length < 1) {
        console.log('ERREUR: Mot-clé manquant, retour code 400');
        return res.status(400).json({ message: 'Un mot-clé de recherche est requis' });
      }
      
      // Valider le type de recherche
      const validTypes = ['general', 'symbol', 'name'];
      const searchType = validTypes.includes(type) ? type : 'general';
      console.log(`Type de recherche validé: ${searchType}`);
      
      // Convertir la limite en nombre
      const searchLimit = parseInt(limit) || 20;
      console.log(`Limite de résultats: ${searchLimit}`);
      
      console.log('Appel au service API...');
      const stocks = await stockApiService.searchStocks(keyword, searchType, searchLimit, exchange);
      console.log(`${stocks.length} résultats reçus du service API`);
      
      if (stocks.length > 0) {
        console.log('Exemple de données (premier résultat):', JSON.stringify(stocks[0]));
      }
      
      console.log('=== FIN du contrôleur searchStocks ===');
      res.status(200).json(stocks);
    } catch (error) {
      console.error('ERREUR GLOBALE dans le contrôleur searchStocks:', error);
      console.error('Stack trace:', error.stack);
      
      logger.error(`Error searching stocks: ${error.message}`);
      res.status(500).json({ message: 'Erreur lors de la recherche d\'actions', error: error.message });
    }
  };

// Obtenir les détails d'une action spécifique (prix, variation, etc.)
exports.getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Un symbole d\'action est requis' });
    }
    
    const stockData = await stockApiService.getStockData(symbol);
    res.status(200).json(stockData);
  } catch (error) {
    logger.error(`Error getting stock details: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails de l\'action', error: error.message });
  }
};

// Obtenir la liste des actions européennes
exports.getEuropeanStocks = async (req, res) => {
  try {
    const stocks = await stockApiService.getEuropeanStocks();
    res.status(200).json(stocks);
  } catch (error) {
    logger.error(`Error getting European stocks: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des actions européennes', error: error.message });
  }
};