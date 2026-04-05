const express = require('express');
const router = express.Router();
const { inscription, connexion, getAllUtilisateurs, inscriptionAdmin } = require('../Controllers/authController');

// Routes existantes
router.post('/auth/inscription', inscription);
router.post('/auth/inscription-admin', inscriptionAdmin);
router.post('/auth/connexion', connexion);
router.get('/utilisateurs', getAllUtilisateurs);

// NOUVELLES ROUTES - Pour compatibilité avec le frontend
router.post('/register', inscription);      // Alias de inscription
router.post('/login', connexion);           // Alias de connexion

module.exports = router;