const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifierToken, verifierAdmin } = require('../middleware/authmiddleware');
const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateStatut,
  deleteTicket
} = require('../Controllers/ticketController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const typesValides = /jpeg|jpg|png|webp|mp4|mov|webm/;
    if (typesValides.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images et vidéos (jpg, png, webp, mp4, mov, webm) sont acceptées'));
    }
  }
});

// Routes publiques (citoyen)
router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketById);
router.post('/tickets', upload.array('attachments', 6), createTicket);

// Routes protégées (admin seulement)
router.patch('/tickets/:id/statut', verifierToken, verifierAdmin, updateStatut);
router.delete('/tickets/:id',       verifierToken, verifierAdmin, deleteTicket);

module.exports = router;