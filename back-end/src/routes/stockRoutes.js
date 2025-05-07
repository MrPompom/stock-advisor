// back-end/src/routes/stockRoutes.js
const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

// Routes pour les données d'actions
router.get('/', stockController.getAllStocks);
router.get('/recommended', stockController.getRecommendedStocks);

module.exports = router;