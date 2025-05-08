// back-end/src/services/stockScrapingService.js
const axios = require('axios');
const cheerio = require('cheerio');
const StockThreshold = require('../models/stockThreshold');
const logger = require('../utils/logger');

class StockScrapingService {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
  }

  async scrapePriceFromUrl(url) {
    try {
      const { data } = await axios.get(url, { 
        headers: this.headers,
        timeout: 10000 
      });
      
      const $ = cheerio.load(data);
      const priceText = $('span.c-instrument.c-instrument--last').text().trim();
      
      // Nettoyer et convertir le prix (gérer les différents formats)
      const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
      
      if (isNaN(price)) {
        throw new Error('Prix invalide extrait de la page');
      }
      
      return price;
    } catch (error) {
      logger.error(`Erreur lors du scraping de ${url}:`, error.message);
      throw error;
    }
  }

  async updateStockPrice(stockId) {
    try {
      const stock = await StockThreshold.findById(stockId);
      if (!stock) {
        throw new Error('Action non trouvée');
      }

      if (!stock.url) {
        throw new Error('URL non définie pour cette action');
      }

      const newPrice = await this.scrapePriceFromUrl(stock.url);
      
      // Calculer les changements
      const previousPrice = stock.currentPrice;
      const change = previousPrice ? newPrice - previousPrice : 0;
      const changePercent = previousPrice ? (change / previousPrice) * 100 : 0;

      // Mettre à jour le document
      stock.currentPrice = newPrice;
      stock.change = change;
      stock.changePercent = changePercent;
      stock.lastUpdated = new Date();

      await stock.save();
      
      logger.info(`Prix mis à jour pour ${stock.symbol}: ${newPrice}`);
      return stock;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du prix pour ${stockId}:`, error);
      throw error;
    }
  }

  async updateAllActiveStocks() {
    try {
      const activeStocks = await StockThreshold.find({ isActive: true });
      logger.info(`Mise à jour de ${activeStocks.length} actions actives`);
      
      const results = [];
      const errors = [];

      for (const stock of activeStocks) {
        try {
          await this.updateStockPrice(stock._id);
          results.push({ symbol: stock.symbol, status: 'success' });
        } catch (error) {
          errors.push({ 
            symbol: stock.symbol, 
            error: error.message 
          });
        }
      }
      
      return {
        success: results.length,
        failed: errors.length,
        errors: errors
      };
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de toutes les actions:', error);
      throw error;
    }
  }
}

module.exports = new StockScrapingService();