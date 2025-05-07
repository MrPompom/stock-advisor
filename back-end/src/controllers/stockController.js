// back-end/src/controllers/stockController.js
const { StockThreshold } = require('../models');
const logger = require('../utils/logger');

// Obtenir toutes les actions avec leurs prix actuels
exports.getAllStocks = async (req, res) => {
  try {
    // Récupérer tous les seuils d'actions actifs avec les données de prix
    const stocks = await StockThreshold.find({ isActive: true });
    
    // Formater les résultats
    const formattedStocks = stocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.currentPrice || 0,
      change: stock.change || 0,
      changePercent: stock.changePercent || 0,
      volume: stock.volume || 0,
      thresholdPrice: stock.thresholdPrice,
      isRecommended: stock.currentPrice ? stock.currentPrice <= stock.thresholdPrice : false,
      lastUpdated: stock.lastUpdated || new Date()
    }));
    
    res.status(200).json(formattedStocks);
  } catch (error) {
    logger.error(`Error getting stocks: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des actions', error: error.message });
  }
};

// Obtenir les actions recommandées (prix inférieur au seuil)
exports.getRecommendedStocks = async (req, res) => {
  try {
    // Récupérer tous les seuils d'actions actifs
    const stocks = await StockThreshold.find({ isActive: true });
    
    // Filtrer pour ne garder que les actions recommandées
    const recommendedStocks = stocks
      .filter(stock => stock.currentPrice && stock.currentPrice <= stock.thresholdPrice)
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.currentPrice || 0,
        change: stock.change || 0,
        changePercent: stock.changePercent || 0,
        volume: stock.volume || 0,
        thresholdPrice: stock.thresholdPrice,
        isRecommended: true,
        lastUpdated: stock.lastUpdated || new Date()
      }));
    
    res.status(200).json(recommendedStocks);
  } catch (error) {
    logger.error(`Error getting recommended stocks: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des actions recommandées', error: error.message });
  }
};