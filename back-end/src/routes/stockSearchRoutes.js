// back-end/src/routes/stockSearchRoutes.js
const express = require('express');
const stockSearchController = require('../controllers/stockSearchController');

const router = express.Router();

// Route pour rechercher des actions
router.get('/', stockSearchController.searchStocks);

// Route pour obtenir les détails d'une action spécifique (prix, variation, etc.)
router.get('/:symbol', stockSearchController.getStockDetails);

// Route pour obtenir la liste des actions européennes
router.get('/market/european', stockSearchController.getEuropeanStocks);

module.exports = router;