// back-end/src/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const logger = require('./utils/logger');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-advisor';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes API
app.use('/api', routes);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'API Stock Advisor fonctionnelle' });
});

// Gestion des erreurs
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Connexion à MongoDB et démarrage du serveur
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connexion à MongoDB établie');
    app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Erreur de connexion à MongoDB: ${err.message}`);
    process.exit(1);
  });

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Connexion MongoDB fermée suite à l\'arrêt de l\'application');
    process.exit(0);
  });
});