// back-end/src/models/stockThreshold.js
const mongoose = require('mongoose');

const stockThresholdSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  thresholdPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  // Nouveau champ pour l'URL
  url: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL invalide'
    }
  },
  // Nouveau champ pour l'indice de risque
  riskLevel: {
    type: String,
    enum: ['faible', 'moyen', 'elevé', 'sevère'],
    default: 'moyen',
    required: true
  },
  // Nouveau champ pour le type d'action (acheter/vendre)
  actionType: {
    type: String,
    enum: ['acheter', 'vendre'],
    default: 'acheter',
    required: true
  },
  // Champs pour stocker les données de prix
  currentPrice: {
    type: Number,
    default: null
  },
  change: {
    type: Number,
    default: null
  },
  changePercent: {
    type: Number,
    default: null
  },
  volume: {
    type: Number,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date de modification
stockThresholdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StockThreshold', stockThresholdSchema);