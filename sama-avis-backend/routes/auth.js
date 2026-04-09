const express = require('express');
const router = express.Router();
const { inscription, connexion, getAllUtilisateurs, inscriptionAdmin } = require('../Controllers/authController');
const { forgotPassword, resetPassword } = require('../Controllers/passwordController');

const { verifierToken, verifierAdmin } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/auth/inscription', inscription);
router.post('/auth/connexion', connexion);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/register', inscription);
router.post('/login', connexion);

// Routes protégées admin
router.post('/auth/inscription-admin', verifierToken, verifierAdmin, inscriptionAdmin);
router.get('/utilisateurs',            verifierToken, verifierAdmin, getAllUtilisateurs);

module.exports = router;