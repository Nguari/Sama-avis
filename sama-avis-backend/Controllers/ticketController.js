const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const { enregistrerChangement } = require('./historiqueController');

const getAllTickets = async (req, res) => {
  try {
    const [tickets] = await db.query('SELECT * FROM tickets ORDER BY date_creation DESC');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getTicketById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ticket introuvable' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getTicketsByUser = async (req, res) => {
  try {
    const [tickets] = await db.query(
      'SELECT * FROM tickets WHERE utilisateur_id = ? ORDER BY date_creation DESC',
      [req.params.utilisateur_id]
    );
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createTicket = async (req, res) => {
  try {
    const { titre, categorie, description, latitude, longitude, utilisateur_id, priorite } = req.body;

    if (!titre || !categorie) {
      return res.status(400).json({ message: 'Le titre et la catégorie sont obligatoires' });
    }

    const prioriteValide = ['normale', 'haute'].includes(priorite) ? priorite : 'normale';
    const id = uuidv4();

    let photo_url = null;
    if (req.files && req.files.length > 0) {
      photo_url = req.files.map(f => `/uploads/${f.filename}`).join(',');
    }

    await db.query(
      `INSERT INTO tickets (id, utilisateur_id, titre, categorie, description, latitude, longitude, photo_url, priorite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, utilisateur_id || null, titre, categorie, description || null, latitude || null, longitude || null, photo_url, prioriteValide]
    );

    await enregistrerChangement(id, null, 'recu', utilisateur_id || null);

    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateStatut = async (req, res) => {
  try {
    const { statut, modifie_par } = req.body;
    const statutsValides = ['recu', 'assigne', 'en_cours', 'resolu'];

    if (!statut || !statutsValides.includes(statut)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${statutsValides.join(', ')}` });
    }

    const [ticket] = await db.query('SELECT statut FROM tickets WHERE id = ?', [req.params.id]);
    if (ticket.length === 0) {
      return res.status(404).json({ message: 'Ticket introuvable' });
    }

    const ancienStatut = ticket[0].statut;
    await db.query('UPDATE tickets SET statut = ? WHERE id = ?', [statut, req.params.id]);
    await enregistrerChangement(req.params.id, ancienStatut, statut, modifie_par || null);

    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM tickets WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket introuvable' });
    }
    res.json({ message: 'Ticket supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getAllTickets, getTicketById, getTicketsByUser, createTicket, updateStatut, deleteTicket };