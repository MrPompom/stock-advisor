const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Hash du code PIN (à remplacer par votre hash)
// Pour générer un hash : bcrypt.hashSync('1702', 10)
const PIN_HASH = '$2b$10$YvaViHCSDYOl6t5lYSu71u.UO3w4DbWQfVez3xKqYQbcPVPHchoXu';

// Route pour vérifier le code PIN
router.post('/pin', async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ message: 'Code PIN requis' });
    }

    // Vérifier le code PIN
    const isValid = await bcrypt.compare(pin, PIN_HASH);

    if (!isValid) {
      logger.warn('Tentative de connexion avec PIN incorrect');
      return res.status(401).json({ message: 'Code PIN incorrect' });
    }

    // Générer un token JWT
    const token = generateToken({ 
      isAdmin: true,
      timestamp: Date.now()
    });

    logger.info('Authentification admin réussie');
    res.json({ 
      success: true,
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    logger.error('Erreur lors de l\'authentification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour vérifier si le token est valide
router.get('/verify', (req, res) => {
  // Le middleware authenticateToken sera utilisé sur cette route
  res.json({ valid: true, user: req.user });
});

module.exports = router;