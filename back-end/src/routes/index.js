// back-end/src/routes/index.js
const express = require('express');
const stockThresholdRoutes = require('./stockThresholdRoutes');
const stockRoutes = require('./stockRoutes');
const stockSearchRoutes = require('./stockSearchRoutes');
const adminRoutes = require('./adminRoutes'); // Ajout de cette ligne

const router = express.Router();

// Routes principales
router.use('/thresholds', stockThresholdRoutes);
router.use('/stocks', stockRoutes);
router.use('/search', stockSearchRoutes);
router.use('/admin', adminRoutes); // Ajout de cette ligne

module.exports = router;