// back-end/src/controllers/stockThresholdController.js
const { StockThreshold } = require('../models');
const logger = require('../utils/logger');

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

// Créer un nouveau seuil
exports.createThreshold = async (req, res) => {
  try {
    const { symbol, name, thresholdPrice } = req.body;
    
    // Vérification des données requises
    if (!symbol || !name || thresholdPrice === undefined) {
      return res.status(400).json({ message: 'Symbole, nom et prix seuil sont requis' });
    }
    
    // Vérifier si le symbole existe déjà
    const existingThreshold = await StockThreshold.findOne({ symbol });
    if (existingThreshold) {
      return res.status(400).json({ message: `Le symbole ${symbol} existe déjà` });
    }
    
    const newThreshold = new StockThreshold({
      symbol,
      name,
      thresholdPrice
    });
    
    const savedThreshold = await newThreshold.save();
    res.status(201).json(savedThreshold);
  } catch (error) {
    logger.error(`Error creating threshold: ${error.message}`);
    res.status(500).json({ message: 'Erreur lors de la création du seuil', error: error.message });
  }
};

// Mettre à jour un seuil
exports.updateThreshold = async (req, res) => {
  try {
    const { thresholdPrice, isActive, name } = req.body;
    const updates = {};
    
    if (thresholdPrice !== undefined) updates.thresholdPrice = thresholdPrice;
    if (isActive !== undefined) updates.isActive = isActive;
    if (name !== undefined) updates.name = name;
    
    const updatedThreshold = await StockThreshold.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedThreshold) {
      return res.status(404).json({ message: 'Seuil non trouvé' });
    }
    
    res.status(200).json(updatedThreshold);
  } catch (error) {
    logger.error(`Error updating threshold: ${error.message}`);
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