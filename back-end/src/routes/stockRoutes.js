// back-end/src/routes/stockRoutes.js
const express = require('express');
const stockController = require('../controllers/stockController');
const StockThreshold = require('../models/stockThreshold');
const stockScrapingService = require('../services/stockScrapingService');

const router = express.Router();

// Routes pour les données d'actions
router.get('/', stockController.getAllStocks);
router.get('/recommended', stockController.getRecommendedStocks);


// Créer une nouvelle action avec URL
router.post('/stocks', async (req, res) => {
  try {
    const stock = new StockThreshold(req.body);
    await stock.save();
    
    // Optionnel : récupérer immédiatement le prix actuel
    if (stock.isActive) {
      await stockScrapingService.updateStockPrice(stock._id);
    }
    
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mettre à jour le prix d'une action spécifique
router.post('/stocks/:id/update-price', async (req, res) => {
  try {
    const updatedStock = await stockScrapingService.updateStockPrice(req.params.id);
    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour toutes les actions actives
router.post('/stocks/update-all-prices', async (req, res) => {
  try {
    const result = await stockScrapingService.updateAllActiveStocks();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;