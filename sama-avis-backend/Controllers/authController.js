const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'sama_avis_secret';

// POST /api/auth/inscription
const inscription = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Nom, email et mot de passe sont obligatoires' });
    }

    const [existing] = await db.query('SELECT id FROM utilisateurs WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const id = uuidv4();

    await db.query(
      'INSERT INTO utilisateurs (id, nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)',
      [id, nom, email, hash, 'citoyen']
    );

    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/auth/connexion
const connexion = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
    }

    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const utilisateur = rows[0];
    const valide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!valide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirection selon le rôle
    const redirect = utilisateur.role === 'admin' ? '/admin' : '/';

    res.json({
      token,
      redirect,
      utilisateur: {
        id:    utilisateur.id,
        nom:   utilisateur.nom,
        email: utilisateur.email,
        role:  utilisateur.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /api/utilisateurs (admin seulement)
const getAllUtilisateurs = async (req, res) => {
  try {
    const [utilisateurs] = await db.query(
      'SELECT id, nom, email, role, date_creation FROM utilisateurs ORDER BY date_creation DESC'
    );
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { inscription, connexion, getAllUtilisateurs };