// visiteController.js — Enregistre et récupère les visites des pages publiques

const db = require('../db/database');

// POST /api/visites — Enregistrer une visite
const enregistrerVisite = async (req, res) => {
  try {
    const { page } = req.body;
    const userAgent = req.headers['user-agent'] || 'Inconnu';

    if (!page) return res.status(400).json({ message: 'Page obligatoire' });

    await db.query(
      'INSERT INTO visites (page, user_agent) VALUES (?, ?)',
      [page, userAgent.substring(0, 255)]
    );

    res.status(201).json({ message: 'Visite enregistrée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/visites — Récupérer les statistiques de visites (admin)
const getVisites = async (req, res) => {
  try {
    // Total des visites
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM visites');

    // Visites par page
    const [parPage] = await db.query(
      `SELECT page, COUNT(*) AS nb
       FROM visites
       GROUP BY page
       ORDER BY nb DESC`
    );

    // Visites des 7 derniers jours
    const [parJour] = await db.query(
      `SELECT DATE(date_visite) AS jour, COUNT(*) AS nb
       FROM visites
       WHERE date_visite >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(date_visite)
       ORDER BY jour ASC`
    );

    // Dernières visites
    const [dernieres] = await db.query(
      `SELECT page, user_agent, date_visite
       FROM visites
       ORDER BY date_visite DESC
       LIMIT 50`
    );

    res.json({ total, parPage, parJour, dernieres });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { enregistrerVisite, getVisites };
