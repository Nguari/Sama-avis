const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// GET /api/temoignages — témoignages approuvés (public)
const getTemoignages = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.id, t.contenu, t.note, t.date_creation, u.nom AS auteur
       FROM temoignages t
       JOIN utilisateurs u ON t.utilisateur_id = u.id
       WHERE t.statut = 'approuve'
       ORDER BY t.date_creation DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/temoignages/tous — tous les témoignages (admin)
const getAllTemoignages = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, u.nom AS auteur, u.email
       FROM temoignages t
       JOIN utilisateurs u ON t.utilisateur_id = u.id
       ORDER BY t.date_creation DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/temoignages — soumettre un témoignage
const createTemoignage = async (req, res) => {
  try {
    const { contenu, note } = req.body;
    const utilisateur_id = req.utilisateur.id;

    if (!contenu || contenu.trim().length < 10) {
      return res.status(400).json({ message: 'Le témoignage doit contenir au moins 10 caractères.' });
    }
    if (contenu.trim().length > 300) {
      return res.status(400).json({ message: 'Maximum 300 caractères.' });
    }

    const noteValide = Number.isInteger(Number(note)) && note >= 1 && note <= 5 ? Number(note) : 5;

    // Vérifier si l'utilisateur a déjà un témoignage en attente ou approuvé
    const [existing] = await db.query(
      "SELECT id FROM temoignages WHERE utilisateur_id = ? AND statut != 'refuse'",
      [utilisateur_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Vous avez déjà soumis un témoignage.' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO temoignages (id, utilisateur_id, contenu, note) VALUES (?, ?, ?, ?)',
      [id, utilisateur_id, contenu.trim(), noteValide]
    );

    res.status(201).json({ message: 'Témoignage soumis ! Il sera publié après validation.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/temoignages/:id/statut — approuver ou refuser (admin)
const updateStatutTemoignage = async (req, res) => {
  try {
    const { statut } = req.body;
    if (!['approuve', 'refuse'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    const [result] = await db.query(
      'UPDATE temoignages SET statut = ? WHERE id = ?',
      [statut, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Témoignage introuvable' });
    res.json({ message: `Témoignage ${statut === 'approuve' ? 'approuvé' : 'refusé'} avec succès.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/temoignages/:id — supprimer (admin)
const deleteTemoignage = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM temoignages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Témoignage introuvable' });
    res.json({ message: 'Témoignage supprimé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getTemoignages, getAllTemoignages, createTemoignage, updateStatutTemoignage, deleteTemoignage };
