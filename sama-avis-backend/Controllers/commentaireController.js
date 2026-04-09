const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// GET /api/tickets/:id/commentaires — tous les commentaires d'un ticket
const getCommentairesByTicket = async (req, res) => {
  try {
    const [commentaires] = await db.query(
      `SELECT c.*, u.nom AS auteur
       FROM commentaires c
       JOIN utilisateurs u ON c.utilisateur_id = u.id
       WHERE c.ticket_id = ?
       ORDER BY c.date_creation ASC`,
      [req.params.id]
    );
    res.json(commentaires);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/tickets/:id/commentaires — ajouter un commentaire
const addCommentaire = async (req, res) => {
  try {
    const { utilisateur_id, contenu } = req.body;

    if (!utilisateur_id || !contenu) {
      return res.status(400).json({ message: 'utilisateur_id et contenu sont obligatoires' });
    }

    const [ticket] = await db.query('SELECT id FROM tickets WHERE id = ?', [req.params.id]);
    if (ticket.length === 0) {
      return res.status(404).json({ message: 'Ticket introuvable' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO commentaires (id, ticket_id, utilisateur_id, contenu) VALUES (?, ?, ?, ?)',
      [id, req.params.id, utilisateur_id, contenu]
    );

    const [rows] = await db.query(
      `SELECT c.*, u.nom AS auteur
       FROM commentaires c
       JOIN utilisateurs u ON c.utilisateur_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/commentaires/:id — supprimer un commentaire
const deleteCommentaire = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM commentaires WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Commentaire introuvable' });
    }
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getCommentairesByTicket, addCommentaire, deleteCommentaire };