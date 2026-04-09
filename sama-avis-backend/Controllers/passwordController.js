const db = require('../db/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email obligatoire' });

    const [rows] = await db.query('SELECT id FROM utilisateurs WHERE email = ?', [email]);
    // On répond toujours OK pour ne pas révéler si l'email existe
    if (rows.length === 0) {
      return res.json({ message: 'Si cet email existe, un lien a été envoyé.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await db.query(
      'UPDATE utilisateurs SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
      [token, expiration, email]
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Sama Avis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border-radius:16px;border:1px solid #e2e8f0">
          <h2 style="color:#1e293b">Réinitialisation du mot de passe</h2>
          <p style="color:#64748b">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans <strong>1 heure</strong>.</p>
          <a href="${resetLink}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#2563eb;color:white;border-radius:12px;text-decoration:none;font-weight:bold">
            Réinitialiser mon mot de passe
          </a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    });

    res.json({ message: 'Si cet email existe, un lien a été envoyé.' });
  } catch (err) {
    console.error('Erreur forgot-password:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, mot_de_passe } = req.body;
    if (!token || !mot_de_passe) return res.status(400).json({ message: 'Token et mot de passe obligatoires' });
    if (mot_de_passe.length < 8)              return res.status(400).json({ message: 'Au moins 8 caractères requis' });
    if (!/[A-Z]/.test(mot_de_passe))          return res.status(400).json({ message: 'Au moins une majuscule requise' });
    if (!/[0-9]/.test(mot_de_passe))          return res.status(400).json({ message: 'Au moins un chiffre requis' });
    if (!/[^A-Za-z0-9]/.test(mot_de_passe))  return res.status(400).json({ message: 'Au moins un caractère spécial requis' });

    const [rows] = await db.query(
      'SELECT id FROM utilisateurs WHERE reset_token = ? AND reset_token_expiration > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Lien invalide ou expiré' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    await db.query(
      'UPDATE utilisateurs SET mot_de_passe = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?',
      [hash, token]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    console.error('Erreur reset-password:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { forgotPassword, resetPassword };
