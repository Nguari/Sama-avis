const express = require('express');
const router  = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/authMiddleware');
const { enregistrerVisite, getVisites } = require('../Controllers/visiteController');

// Public — enregistrer une visite (pas besoin d'être connecté)
router.post('/visites', enregistrerVisite);

// Admin — voir les statistiques
router.get('/visites', verifierToken, verifierAdmin, getVisites);

module.exports = router;
