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
      riskLevel: stock.riskLevel || 'moyen',
      actionType: stock.actionType || 'acheter',
      url: stock.url,
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
    
    // Filtrer pour ne garder que les actions recommandées selon leur type
    const recommendedStocks = stocks
      .filter(stock => {
        if (!stock.currentPrice) return false;
        
        // Logique inversée selon le type d'action
        if (stock.actionType === 'acheter') {
          return stock.currentPrice <= stock.thresholdPrice;
        } else { // vendre
          return stock.currentPrice >= stock.thresholdPrice;
        }
      })
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.currentPrice || 0,
        change: stock.change || 0,
        changePercent: stock.changePercent || 0,
        volume: stock.volume || 0,
        thresholdPrice: stock.thresholdPrice,
        isRecommended: true,
        lastUpdated: stock.lastUpdated || new Date(),
        // Nouveaux champs
        riskLevel: stock.riskLevel || 'moyen',
        actionType: stock.actionType || 'acheter',
        // Ajout de l'URL pour l'affichage
        url: stock.url
      }));
    
    // Trier par niveau de risque (faible en premier)
    const sortedRecommendations = recommendedStocks.sort((a, b) => {
      const riskOrder = { 'faible': 0, 'moyen': 1, 'elevé': 2, 'sevère': 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });
    
    res.status(200).json(sortedRecommendations);
  } catch (error) {
    logger.error(`Error getting recommended stocks: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des actions recommandées', error: error.message });
  }
};

exports.getRecommendedStocksByType = async (req, res) => {
  try {
    const { type } = req.query; // 'acheter' ou 'vendre'
    
    // Récupérer tous les seuils d'actions actifs
    let query = { isActive: true };
    if (type && ['acheter', 'vendre'].includes(type)) {
      query.actionType = type;
    }
    
    const stocks = await StockThreshold.find(query);
    
    // Filtrer pour ne garder que les actions recommandées selon leur type
    const recommendedStocks = stocks
      .filter(stock => {
        if (!stock.currentPrice) return false;
        
        if (stock.actionType === 'acheter') {
          return stock.currentPrice <= stock.thresholdPrice;
        } else { // vendre
          return stock.currentPrice >= stock.thresholdPrice;
        }
      })
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.currentPrice || 0,
        change: stock.change || 0,
        changePercent: stock.changePercent || 0,
        volume: stock.volume || 0,
        thresholdPrice: stock.thresholdPrice,
        isRecommended: true,
        lastUpdated: stock.lastUpdated || new Date(),
        riskLevel: stock.riskLevel || 'moyen',
        actionType: stock.actionType || 'acheter',
        url: stock.url
      }));
    
    // Trier par niveau de risque
    const sortedRecommendations = recommendedStocks.sort((a, b) => {
      const riskOrder = { 'faible': 0, 'moyen': 1, 'elevé': 2, 'sevère': 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });
    
    res.status(200).json(sortedRecommendations);
  } catch (error) {
    logger.error(`Error getting recommended stocks by type: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des actions recommandées', error: error.message });
  }
};

// Méthode optionnelle pour obtenir un résumé des recommandations
exports.getRecommendationsSummary = async (req, res) => {
  try {
    const stocks = await StockThreshold.find({ isActive: true });
    
    // Compter les recommandations par type et niveau de risque
    const summary = {
      total: 0,
      byType: {
        acheter: 0,
        vendre: 0
      },
      byRisk: {
        faible: 0,
        moyen: 0,
        elevé: 0,
        sevère: 0
      }
    };
    
    stocks.forEach(stock => {
      if (!stock.currentPrice) return;
      
      let isRecommended = false;
      if (stock.actionType === 'acheter' && stock.currentPrice <= stock.thresholdPrice) {
        isRecommended = true;
      } else if (stock.actionType === 'vendre' && stock.currentPrice >= stock.thresholdPrice) {
        isRecommended = true;
      }
      
      if (isRecommended) {
        summary.total++;
        summary.byType[stock.actionType]++;
        summary.byRisk[stock.riskLevel]++;
      }
    });
    
    res.status(200).json(summary);
  } catch (error) {
    logger.error(`Error getting recommendations summary: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération du résumé', error: error.message });
  }
};