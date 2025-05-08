// back-end/src/jobs/stockPriceUpdater.js
const cron = require('node-cron');
const stockScrapingService = require('../services/stockScrapingService');
const logger = require('../utils/logger');

const startStockPriceUpdater = () => {
  // Toutes les 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Début de la mise à jour automatique des prix');
    try {
      const result = await stockScrapingService.updateAllActiveStocks();
      logger.info(`Mise à jour automatique terminée: ${result.success} réussites, ${result.failed} échecs`);
      
      if (result.errors.length > 0) {
        logger.warn('Erreurs lors de la mise à jour automatique:', result.errors);
      }
    } catch (error) {
      logger.error('Erreur dans le job de mise à jour automatique:', error);
    }
  });

  logger.info('Job de mise à jour des prix initialisé (toutes les 5 minutes)');
};

module.exports = { startStockPriceUpdater };