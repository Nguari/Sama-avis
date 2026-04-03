const express = require('express');
const router = express.Router();
const { getHistoriqueByTicket } = require('../Controllers/historiqueController');

// Historique des statuts d'un ticket
router.get('/tickets/:id/historique', getHistoriqueByTicket);

module.exports = router;