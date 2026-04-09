const express = require('express');
const router = express.Router();
const { getNotificationsByUser, createNotification, marquerCommeLue, deleteNotification } = require('../Controllers/notificationController');

const { verifierToken } = require('../middleware/authMiddleware');

// Notifications d'un utilisateur
router.get('/notifications/:utilisateur_id',  verifierToken, getNotificationsByUser);

// Créer une notification
router.post('/notifications',                 verifierToken, createNotification);

// Marquer comme lue
router.patch('/notifications/:id/lu',         verifierToken, marquerCommeLue);

// Supprimer une notification
router.delete('/notifications/:id',           verifierToken, deleteNotification);

module.exports = router;