const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// GET /api/notifications/:utilisateur_id — notifications d'un utilisateur
const getNotificationsByUser = async (req, res) => {
  try {
    const [notifications] = await db.query(
      `SELECT n.*, t.titre AS ticket_titre
       FROM notifications n
       JOIN tickets t ON n.ticket_id = t.id
       WHERE n.utilisateur_id = ?
       ORDER BY n.date_creation DESC`,
      [req.params.utilisateur_id]
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/notifications — créer une notification
const createNotification = async (req, res) => {
  try {
    const { utilisateur_id, ticket_id, message } = req.body;
    if (!utilisateur_id || !ticket_id || !message) {
      return res.status(400).json({ message: 'utilisateur_id, ticket_id et message sont obligatoires' });
    }
    const id = uuidv4();
    await db.query(
      'INSERT INTO notifications (id, utilisateur_id, ticket_id, message) VALUES (?, ?, ?, ?)',
      [id, utilisateur_id, ticket_id, message]
    );
    const [rows] = await db.query('SELECT * FROM notifications WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/notifications/:id/lu — marquer une notification comme lue
const marquerCommeLue = async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE notifications SET lu = 1 WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }
    res.json({ message: 'Notification marquée comme lue' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/notifications/:id — supprimer une notification
const deleteNotification = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }
    res.json({ message: 'Notification supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getNotificationsByUser, createNotification, marquerCommeLue, deleteNotification };