const express = require('express');
const router = express.Router();
const { getNotificationsByUser, createNotification, marquerCommeLue, deleteNotification } = require('../Controllers/notificationController');

// Notifications d'un utilisateur
router.get('/notifications/:utilisateur_id', getNotificationsByUser);

// Créer une notification
router.post('/notifications', createNotification);

// Marquer comme lue
router.patch('/notifications/:id/lu', marquerCommeLue);

// Supprimer une notification
router.delete('/notifications/:id', deleteNotification);

module.exports = router;