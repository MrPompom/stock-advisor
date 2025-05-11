// back-end/src/controllers/stockThresholdController.js
const { StockThreshold } = require('../models');
const logger = require('../utils/logger');
const stockScrapingService = require('../services/stockScrapingService');

// Obtenir tous les seuils d'actions
exports.getAllThresholds = async (req, res) => {
  try {
    const thresholds = await StockThreshold.find();
    res.status(200).json(thresholds);
  } catch (error) {
    logger.error(`Error getting thresholds: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération des seuils', error: error.message });
  }
};

// Obtenir un seuil spécifique
exports.getThreshold = async (req, res) => {
  try {
    const threshold = await StockThreshold.findById(req.params.id);
    if (!threshold) {
      return res.status(404).json({ message: 'Seuil non trouvé' });
    }
    res.status(200).json(threshold);
  } catch (error) {
    logger.error(`Error getting threshold: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la récupération du seuil', error: error.message });
  }
};

// Créer un nouveau seuil (version mise à jour avec URL)
exports.createThreshold = async (req, res) => {
  try {
    const { symbol, name, thresholdPrice, url, isActive, riskLevel, actionType } = req.body;
    
    // Vérification des données requises
    if (!symbol || !name || thresholdPrice === undefined || !url) {
      return res.status(400).json({ message: 'Symbole, nom, prix seuil et URL sont requis' });
    }
    
    // Vérifier si le symbole existe déjà
    const existingThreshold = await StockThreshold.findOne({ symbol });
    if (existingThreshold) {
      return res.status(400).json({ message: `Le symbole ${symbol} existe déjà` });
    }
    
    const newThreshold = new StockThreshold({
      symbol,
      name,
      thresholdPrice,
      url,
      isActive,
      riskLevel: riskLevel || 'moyen', // Valeur par défaut
      actionType: actionType || 'acheter' // Valeur par défaut
    });

    console.log('Données reçues:', { symbol, name, thresholdPrice, url, isActive, riskLevel, actionType });
    
    const savedThreshold = await newThreshold.save();
    
    // Si l'action est active, récupérer immédiatement le prix
    if (savedThreshold.isActive) {
      try {
        await stockScrapingService.updateStockPrice(savedThreshold._id);
        logger.info(`Prix initial récupéré pour: ${savedThreshold.symbol}`);
      } catch (scrapingError) {
        logger.warn(`Impossible de récupérer le prix initial pour ${savedThreshold.symbol}:`, scrapingError);
        // On continue quand même, le stock est créé
      }
    }
    
    res.status(201).json(savedThreshold);
  } catch (error) {
    logger.error(`Error creating threshold: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la création du seuil', error: error.message });
  }
};

// Mettre à jour un seuil
exports.updateThreshold = async (req, res) => {
  try {
    const { thresholdPrice, isActive, name, url, riskLevel, actionType } = req.body;
    const updates = {};
    
    if (thresholdPrice !== undefined) updates.thresholdPrice = thresholdPrice;
    if (isActive !== undefined) updates.isActive = isActive;
    if (name !== undefined) updates.name = name;
    if (url !== undefined) updates.url = url;
    if (riskLevel !== undefined) updates.riskLevel = riskLevel;
    if (actionType !== undefined) updates.actionType = actionType;
    
    const updatedThreshold = await StockThreshold.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedThreshold) {
      return res.status(404).json({ message: 'Seuil non trouvé' });
    }
    
    // Si l'action vient d'être activée et n'a pas de prix actuel, récupérer le prix
    if (updates.isActive === true && !updatedThreshold.currentPrice) {
      try {
        const stockWithPrice = await stockScrapingService.updateStockPrice(updatedThreshold._id);
        logger.info(`Prix récupéré pour l'action nouvellement activée: ${stockWithPrice.symbol}`);
        return res.status(200).json(stockWithPrice);
      } catch (scrapingError) {
        logger.warn(`Impossible de récupérer le prix pour ${updatedThreshold.symbol}:`, scrapingError);
        // On retourne quand même le threshold mis à jour
        return res.status(200).json(updatedThreshold);
      }
    }
    
    res.status(200).json(updatedThreshold);
  } catch (error) {
    logger.error(`Error updating threshold: ${error.message}`);
    logger.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du seuil', error: error.message });
  }
};

// Supprimer un seuil
exports.deleteThreshold = async (req, res) => {
  try {
    const deletedThreshold = await StockThreshold.findByIdAndDelete(req.params.id);
    
    if (!deletedThreshold) {
      return res.status(404).json({ message: 'Seuil non trouvé' });
    }
    
    res.status(200).json({ message: 'Seuil supprimé avec succès' });
  } catch (error) {
    logger.error(`Error deleting threshold: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la suppression du seuil', error: error.message });
  }
};

// Mettre à jour le prix d'une action spécifique
exports.updateStockPrice = async (req, res) => {
  try {
    const updatedStock = await stockScrapingService.updateStockPrice(req.params.id);
    logger.info(`Prix mis à jour pour: ${updatedStock.symbol}`);
    res.json(updatedStock);
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du prix pour ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour tous les prix des actions actives
exports.updateAllPrices = async (req, res) => {
  try {
    const result = await stockScrapingService.updateAllActiveStocks();
    logger.info('Mise à jour manuelle de tous les prix terminée');
    res.json(result);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de tous les prix:', error);
    res.status(500).json({ error: error.message });
  }
};