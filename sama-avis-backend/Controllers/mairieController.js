const nodemailer = require('nodemailer');
const db = require('../db/database');

// Mairies de Dakar avec leurs coordonnées GPS et emails
const MAIRIES = [
  { nom: 'Mairie de Dakar Plateau',       email: 'mairie.plateau@dakar.sn',       lat: 14.6937, lng: -17.4441, quartiers: ['plateau', 'médina', 'fann', 'point e', 'amitié'] },
  { nom: 'Mairie de Médina',              email: 'mairie.medina@dakar.sn',         lat: 14.6892, lng: -17.4523, quartiers: ['médina', 'gueule tapée', 'fass', 'colobane'] },
  { nom: 'Mairie de Gueule Tapée',        email: 'mairie.gueule-tapee@dakar.sn',   lat: 14.6850, lng: -17.4580, quartiers: ['gueule tapée', 'fass', 'colobane', 'liberté'] },
  { nom: 'Mairie de Grand Dakar',         email: 'mairie.grand-dakar@dakar.sn',    lat: 14.7100, lng: -17.4600, quartiers: ['grand dakar', 'hann bel air', 'dieuppeul', 'derklé'] },
  { nom: 'Mairie de Parcelles Assainies', email: 'mairie.parcelles@dakar.sn',      lat: 14.7650, lng: -17.4200, quartiers: ['parcelles assainies', 'cambérène', 'golf'] },
  { nom: 'Mairie de Pikine',              email: 'mairie.pikine@pikine.sn',         lat: 14.7500, lng: -17.3900, quartiers: ['pikine', 'thiaroye', 'guinaw rails', 'diamaguene'] },
  { nom: 'Mairie de Guédiawaye',          email: 'mairie.guediawaye@guediawaye.sn', lat: 14.7800, lng: -17.3950, quartiers: ['guédiawaye', 'golf sud', 'ndiarème', 'sam notaire'] },
  { nom: 'Mairie de Keur Massar',         email: 'mairie.keurmassar@dakar.sn',     lat: 14.7900, lng: -17.3300, quartiers: ['keur massar', 'malika', 'jaxaay'] },
  { nom: 'Mairie de Rufisque',            email: 'mairie.rufisque@rufisque.sn',     lat: 14.7167, lng: -17.2667, quartiers: ['rufisque', 'bargny', 'sébikotane'] },
  { nom: 'Mairie de Yoff',               email: 'mairie.yoff@dakar.sn',            lat: 14.7500, lng: -17.4900, quartiers: ['yoff', 'ngor', 'almadies', 'ouakam'] },
  { nom: 'Mairie de Ouakam',             email: 'mairie.ouakam@dakar.sn',           lat: 14.7300, lng: -17.5000, quartiers: ['ouakam', 'almadies', 'ngor', 'mamelles'] },
  { nom: 'Mairie de Hann Bel Air',       email: 'mairie.hann@dakar.sn',             lat: 14.7200, lng: -17.4100, quartiers: ['hann', 'bel air', 'port'] },
];

// Calcul distance Haversine entre deux points GPS
const distanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// Trouver la mairie la plus proche selon GPS ou adresse
const trouverMairieProche = (latitude, longitude, adresse) => {
  // Si GPS disponible → calcul par distance
  if (latitude && longitude) {
    let mairieProche = MAIRIES[0];
    let distMin = Infinity;
    for (const m of MAIRIES) {
      const d = distanceKm(parseFloat(latitude), parseFloat(longitude), m.lat, m.lng);
      if (d < distMin) { distMin = d; mairieProche = m; }
    }
    return { mairie: mairieProche, methode: 'GPS', distance: distMin.toFixed(1) };
  }

  // Sinon → recherche par mots-clés dans l'adresse
  if (adresse) {
    const adresseLower = adresse.toLowerCase();
    for (const m of MAIRIES) {
      if (m.quartiers.some(q => adresseLower.includes(q))) {
        return { mairie: m, methode: 'adresse', distance: null };
      }
    }
  }

  // Par défaut → Mairie de Dakar Plateau
  return { mairie: MAIRIES[0], methode: 'défaut', distance: null };
};

// GET /api/tickets/:id/mairie-proche
const getMairieProche = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Ticket introuvable' });

    const ticket = rows[0];
    const result = trouverMairieProche(ticket.latitude, ticket.longitude, ticket.adresse || ticket.description);
    res.json({ ...result, toutes_mairies: MAIRIES.map(m => ({ nom: m.nom, email: m.email })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/tickets/:id/envoyer-mairie
const envoyerAMairie = async (req, res) => {
  try {
    const { email_mairie, nom_mairie, message_admin } = req.body;

    if (!email_mairie || !nom_mairie) {
      return res.status(400).json({ message: 'Email et nom de la mairie sont obligatoires' });
    }

    const [rows] = await db.query('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Ticket introuvable' });

    const ticket = rows[0];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const categorieLabels = {
      voirie: 'Voirie / Routes', eclairage: 'Éclairage Public',
      proprete: 'Propreté & Déchets', eau: 'Eau & Assainissement',
      sante: 'Santé & Sécurité', autre: 'Autre'
    };

    const prioriteLabel = ticket.priorite === 'haute' ? '🚨 CRITIQUE — Intervention urgente requise' : '⚖️ Standard';
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    const photoSection  = ticket.photo_url
      ? `<p><strong>Photos :</strong> ${ticket.photo_url.split(',').map((u, i) => `<a href="${BACKEND_URL}${u}">Photo ${i+1}</a>`).join(' | ')}</p>`
      : '<p><em>Aucune photo jointe</em></p>';
    const gpsSection = ticket.latitude && ticket.longitude
      ? `<p><strong>GPS :</strong> <a href="https://www.google.com/maps?q=${ticket.latitude},${ticket.longitude}">Voir sur Google Maps</a></p>`
      : '';

    await transporter.sendMail({
      from: `"Sama Avis — Plateforme Citoyenne" <${process.env.EMAIL_USER}>`,
      to: email_mairie,
      subject: `[SAMA AVIS] Signalement citoyen — ${ticket.titre}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
          <div style="background:#0f172a;padding:32px;color:white">
            <h1 style="margin:0;font-size:24px">📢 Sama Avis</h1>
            <p style="margin:8px 0 0;color:#94a3b8;font-size:14px">Plateforme Citoyenne de Dakar</p>
          </div>
          <div style="padding:32px">
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:24px">
              <p style="margin:0;font-weight:bold;color:#dc2626;font-size:14px">${prioriteLabel}</p>
            </div>
            <h2 style="color:#1e293b;font-size:20px">${ticket.titre}</h2>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:140px"><strong>Catégorie</strong></td><td style="padding:8px 0;font-size:13px">${categorieLabels[ticket.categorie] || ticket.categorie}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px"><strong>Statut actuel</strong></td><td style="padding:8px 0;font-size:13px">${ticket.statut}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px"><strong>Date signalement</strong></td><td style="padding:8px 0;font-size:13px">${new Date(ticket.date_creation).toLocaleDateString('fr-FR')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px"><strong>Référence</strong></td><td style="padding:8px 0;font-size:13px;font-family:monospace">#${ticket.id.substring(0, 8)}</td></tr>
            </table>
            ${ticket.description ? `<div style="background:#f8fafc;border-radius:12px;padding:16px;margin:16px 0"><p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:13px">Description</p><p style="margin:0;color:#475569;font-size:13px;line-height:1.6">${ticket.description}</p></div>` : ''}
            ${gpsSection}
            ${photoSection}
            ${message_admin ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;margin:16px 0"><p style="margin:0 0 8px;font-weight:bold;color:#1d4ed8;font-size:13px">Message de l'administrateur</p><p style="margin:0;color:#1e40af;font-size:13px">${message_admin}</p></div>` : ''}
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0">
              <p style="color:#94a3b8;font-size:12px;margin:0">Ce signalement vous est transmis par la plateforme <strong>Sama Avis</strong> au nom des citoyens de Dakar. Merci de traiter ce dossier dans les meilleurs délais.</p>
            </div>
          </div>
        </div>
      `,
    }).catch(emailErr => {
      console.error('Avertissement email:', emailErr.message);
      // On continue même si l\'email échoue
    });

    // Marquer le ticket comme transmis
    await db.query('UPDATE tickets SET statut = ? WHERE id = ?', ['assigne', ticket.id]);
    await db.query(
      'UPDATE tickets SET mairie_destinataire = ? WHERE id = ?',
      [nom_mairie, ticket.id]
    ).catch(() => {}); // ignore si colonne pas encore créée

    res.json({ message: `Signalement transmis à ${nom_mairie} avec succès !` });
  } catch (err) {
    console.error('Erreur envoi mairie:', err);
    res.status(500).json({ message: 'Erreur lors de l\'envoi. Vérifiez la configuration email.' });
  }
};

module.exports = { getMairieProche, envoyerAMairie, MAIRIES };
