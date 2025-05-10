// back-end/src/routes/index.js
const express = require('express');
const { authenticateToken } = require('../middleware/auth');

// Import des routes
const authRoutes = require('./auth');
const stockThresholdRoutes = require('./stockThresholdRoutes');
const stockRoutes = require('./stockRoutes');
const stockSearchRoutes = require('./stockSearchRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Routes publiques (accessibles sans authentification)
router.use('/auth', authRoutes);
router.use('/stocks', stockRoutes);
router.use('/search', stockSearchRoutes);

// Routes protégées (nécessitent une authentification)
router.use('/thresholds', authenticateToken, stockThresholdRoutes);
router.use('/admin', authenticateToken, adminRoutes);

module.exports = router;