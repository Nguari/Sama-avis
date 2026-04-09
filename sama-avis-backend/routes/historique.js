const express = require('express');
const router = express.Router();
const { getHistoriqueByTicket } = require('../Controllers/historiqueController');

const { verifierToken } = require('../middleware/authMiddleware');

// Historique des statuts d'un ticket
router.get('/tickets/:id/historique', verifierToken, getHistoriqueByTicket);

module.exports = router;