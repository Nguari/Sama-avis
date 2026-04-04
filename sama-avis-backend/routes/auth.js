const express = require('express');
const router = express.Router();
const { inscription, connexion, getAllUtilisateurs, inscriptionAdmin } = require('../Controllers/authController');

// Inscription d'un nouveau citoyen
router.post('/auth/inscription', inscription);

// Inscription d'un administrateur (route sécurisée)
router.post('/auth/inscription-admin', inscriptionAdmin);

// Connexion
router.post('/auth/connexion', connexion);

// Liste des utilisateurs (admin)
router.get('/utilisateurs', getAllUtilisateurs);

module.exports = router;