const express = require('express');
const router  = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/authMiddleware');
const {
  getTemoignages, getAllTemoignages,
  createTemoignage, updateStatutTemoignage, deleteTemoignage
} = require('../Controllers/temoignageController');

// Public
router.get('/temoignages', getTemoignages);

// Admin — doit être AVANT /:id pour éviter le conflit de route
router.get('/temoignages/tous',          verifierToken, verifierAdmin, getAllTemoignages);
router.patch('/temoignages/:id/statut',  verifierToken, verifierAdmin, updateStatutTemoignage);
router.delete('/temoignages/:id',        verifierToken, verifierAdmin, deleteTemoignage);

// Citoyen connecté
router.post('/temoignages', verifierToken, createTemoignage);

module.exports = router;
