const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// GET /api/tickets/:id/historique — historique des statuts d'un ticket
const getHistoriqueByTicket = async (req, res) => {
  try {
    const [historique] = await db.query(
      `SELECT h.*, u.nom AS modifie_par_nom
       FROM historique_statuts h
       LEFT JOIN utilisateurs u ON h.modifie_par = u.id
       WHERE h.ticket_id = ?
       ORDER BY h.date_changement ASC`,
      [req.params.id]
    );
    res.json(historique);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Fonction interne — appelée automatiquement quand un statut change
const enregistrerChangement = async (ticket_id, ancien_statut, nouveau_statut, modifie_par = null) => {
  const id = uuidv4();
  await db.query(
    'INSERT INTO historique_statuts (id, ticket_id, ancien_statut, nouveau_statut, modifie_par) VALUES (?, ?, ?, ?, ?)',
    [id, ticket_id, ancien_statut, nouveau_statut, modifie_par]
  );
};

module.exports = { getHistoriqueByTicket, enregistrerChangement };