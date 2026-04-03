const express = require('express');
const router = express.Router();
const { inscription, connexion, getAllUtilisateurs } = require('../Controllers/authController');

// Inscription d'un nouveau citoyen
router.post('/auth/inscription', inscription);

// Connexion
router.post('/auth/connexion', connexion);

// Liste des utilisateurs (admin)
router.get('/utilisateurs', getAllUtilisateurs);

module.exports = router;