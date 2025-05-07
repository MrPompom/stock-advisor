// back-end/src/routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route pour rafraîchir manuellement les données
router.post('/refresh-stocks', adminController.refreshStocksData);

// Route pour obtenir la date de dernière mise à jour
router.get('/last-update', adminController.getLastUpdateTime);

module.exports = router;