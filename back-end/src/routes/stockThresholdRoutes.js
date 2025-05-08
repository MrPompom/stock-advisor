// back-end/src/routes/stockThresholdRoutes.js
const express = require('express');
const stockThresholdController = require('../controllers/stockThresholdController');

const router = express.Router();

// Routes existantes
router.get('/', stockThresholdController.getAllThresholds);
router.get('/:id', stockThresholdController.getThreshold);
router.post('/', stockThresholdController.createThreshold);
router.put('/:id', stockThresholdController.updateThreshold);
router.delete('/:id', stockThresholdController.deleteThreshold);

// Nouvelles routes pour le scraping
router.post('/:id/update-price', stockThresholdController.updateStockPrice);
router.post('/update-all-prices', stockThresholdController.updateAllPrices);

module.exports = router;