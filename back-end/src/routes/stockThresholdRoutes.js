// back-end/src/routes/stockThresholdRoutes.js
const express = require('express');
const stockThresholdController = require('../controllers/stockThresholdController');

const router = express.Router();

// Routes pour les seuils d'actions
router.get('/', stockThresholdController.getAllThresholds);
router.get('/:id', stockThresholdController.getThreshold);
router.post('/', stockThresholdController.createThreshold);
router.put('/:id', stockThresholdController.updateThreshold);
router.delete('/:id', stockThresholdController.deleteThreshold);

module.exports = router;