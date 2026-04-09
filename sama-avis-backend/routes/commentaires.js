const express = require('express');
const router = express.Router();
const { getCommentairesByTicket, addCommentaire, deleteCommentaire } = require('../Controllers/commentaireController');

const { verifierToken } = require('../middleware/authMiddleware');

// Commentaires d'un ticket
router.get('/tickets/:id/commentaires',  verifierToken, getCommentairesByTicket);

// Ajouter un commentaire
router.post('/tickets/:id/commentaires', verifierToken, addCommentaire);

// Supprimer un commentaire
router.delete('/commentaires/:id',       verifierToken, deleteCommentaire);

module.exports = router;