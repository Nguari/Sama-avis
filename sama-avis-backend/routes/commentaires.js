const express = require('express');
const router = express.Router();
const { getCommentairesByTicket, addCommentaire, deleteCommentaire } = require('../Controllers/commentaireController');

// Commentaires d'un ticket
router.get('/tickets/:id/commentaires', getCommentairesByTicket);

// Ajouter un commentaire à un ticket
router.post('/tickets/:id/commentaires', addCommentaire);

// Supprimer un commentaire
router.delete('/commentaires/:id', deleteCommentaire);

module.exports = router;