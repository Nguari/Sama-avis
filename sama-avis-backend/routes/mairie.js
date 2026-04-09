const express = require('express');
const router  = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/authMiddleware');
const { getMairieProche, envoyerAMairie } = require('../Controllers/mairieController');

router.get('/tickets/:id/mairie-proche',   verifierToken, verifierAdmin, getMairieProche);
router.post('/tickets/:id/envoyer-mairie', verifierToken, verifierAdmin, envoyerAMairie);

module.exports = router;
