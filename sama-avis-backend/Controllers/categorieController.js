const db = require('../db/database');

// GET /api/categories — toutes les catégories
const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY nom ASC');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/categories — ajouter une catégorie (admin)
const createCategorie = async (req, res) => {
  try {
    const { nom, icone } = req.body;
    if (!nom) {
      return res.status(400).json({ message: 'Le nom est obligatoire' });
    }
    const [result] = await db.query(
      'INSERT INTO categories (nom, icone) VALUES (?, ?)',
      [nom, icone || null]
    );
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/categories/:id — supprimer une catégorie (admin)
const deleteCategorie = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getAllCategories, createCategorie, deleteCategorie };