const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'sama_avis_secret';

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email obligatoire' });
    }

    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);

    // Pour la sécurité on répond toujours la même chose
    // même si l'email n'existe pas
    if (rows.length === 0) {
      return res.json({ message: 'Si cet email existe, un lien vous a été envoyé.' });
    }

    const utilisateur = rows[0];

    // Génère un token de réinitialisation valable 1 heure
    const resetToken = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      JWT_SECRET + utilisateur.mot_de_passe, // secret unique par utilisateur
      { expiresIn: '1h' }
    );

    // Lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // Pour l'instant on affiche le lien dans la console
    // (à remplacer par un vrai envoi d'email avec nodemailer)
    console.log('Lien de réinitialisation :', resetLink);

    res.json({ message: 'Si cet email existe, un lien vous a été envoyé.' });

  } catch (err) {
    console.error('Erreur forgot-password:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, nouveau_mot_de_passe } = req.body;

    if (!token || !nouveau_mot_de_passe) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe obligatoires' });
    }

    if (nouveau_mot_de_passe.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' });
    }

    // Décode d'abord le token sans vérification pour récupérer l'email
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    // Récupère l'utilisateur
    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [decoded.email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Utilisateur introuvable' });
    }

    const utilisateur = rows[0];

    // Vérifie le token avec le secret unique
    try {
      jwt.verify(token, JWT_SECRET + utilisateur.mot_de_passe);
    } catch {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    // Hash le nouveau mot de passe
    const hash = await bcrypt.hash(nouveau_mot_de_passe, 10);

    // Met à jour le mot de passe
    await db.query('UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?', [hash, utilisateur.id]);

    res.json({ message: 'Mot de passe réinitialisé avec succès !' });

  } catch (err) {
    console.error('Erreur reset-password:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { forgotPassword, resetPassword };