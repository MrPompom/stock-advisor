// back-end/src/controllers/adminController.js
const { StockThreshold } = require('../models');
const stockScrapingService = require('../services/stockScrapingService');
const logger = require('../utils/logger');

// Obtenir la date de dernière mise à jour
exports.getLastUpdateTime = async (req, res) => {
  console.log('=== DÉBUT getLastUpdateTime ===');
  try {
    console.log('Recherche de l\'action la plus récemment mise à jour...');
    // Trouver l'action la plus récemment mise à jour
    const latestStock = await StockThreshold.findOne({ lastUpdated: { $ne: null } })
      .sort({ lastUpdated: -1 })
      .limit(1);
    
    console.log('Résultat de la recherche:', latestStock ? 
      `Action trouvée: ${latestStock.symbol}, dernière mise à jour: ${latestStock.lastUpdated}` : 
      'Aucune action avec date de mise à jour');
    
    if (!latestStock) {
      console.log('Aucune action mise à jour trouvée, retourne null');
      return res.status(200).json({ lastUpdate: null });
    }
    
    console.log('=== FIN getLastUpdateTime ===');
    res.status(200).json({ lastUpdate: latestStock.lastUpdated });
  } catch (error) {
    console.error('ERREUR dans getLastUpdateTime:', error);
    console.error('Stack trace:', error.stack);
    logger.error(`Error getting last update time: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération de la date de mise à jour', error: error.message });
  }
};

// Rafraîchir manuellement les données via scrapping
exports.refreshStocksData = async (req, res) => {
  console.log('=== DÉBUT refreshStocksData ===');
  try {
    console.log('Début de la mise à jour des données via scrapping...');
    
    // Appel au service de scrapping pour mettre à jour toutes les actions actives
    const updateResult = await stockScrapingService.updateAllActiveStocks();
    
    console.log('Résultat de la mise à jour:', JSON.stringify(updateResult));
    
    // Obtenir le nombre total d'actions actives pour un meilleur feedback
    const activeStocks = await StockThreshold.countDocuments({ isActive: true });
    
    console.log('=== FIN refreshStocksData ===');
    res.status(200).json({
      message: `Mise à jour terminée: ${updateResult.success}/${activeStocks} actions mises à jour`,
      timestamp: new Date(),
      details: {
        total: activeStocks,
        success: updateResult.success,
        failed: updateResult.failed,
        errors: updateResult.errors
      }
    });
  } catch (error) {
    console.error('ERREUR GLOBALE dans refreshStocksData:', error);
    console.error('Stack trace:', error.stack);
    logger.error(`Error refreshing stocks data: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors du rafraîchissement des données', error: error.message });
  }
};