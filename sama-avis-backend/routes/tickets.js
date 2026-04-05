const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifierToken, verifierAdmin } = require('../middleware/authMiddleware');
const {
  getAllTickets,
  getTicketById,
  getTicketsByUser,
  createTicket,
  updateStatut,
  deleteTicket
} = require('../controllers/ticketController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB par fichier
  fileFilter: (req, file, cb) => {
    const typesValides = /jpeg|jpg|png|webp/;
    if (typesValides.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images jpg, png et webp sont acceptées'));
    }
  }
});

// Routes publiques
router.get('/tickets', getAllTickets);
router.get('/tickets/user/:utilisateur_id', getTicketsByUser);
router.get('/tickets/:id', getTicketById);

// Accepte jusqu'à 6 photos avec le champ 'photos'
router.post('/tickets', upload.array('photos', 6), createTicket);

// Routes protégées admin
router.patch('/tickets/:id/statut', verifierToken, verifierAdmin, updateStatut);
router.delete('/tickets/:id',       verifierToken, verifierAdmin, deleteTicket);

module.exports = router;