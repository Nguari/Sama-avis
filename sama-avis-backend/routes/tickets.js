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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const typesValides = /jpeg|jpg|png|webp/;
    if (typesValides.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images jpg, png et webp sont acceptées'));
    }
  }
});

// Routes publiques (citoyen)
router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketById);
router.post('/tickets', upload.single('photo'), createTicket);

// Routes protégées (admin seulement)
router.patch('/tickets/:id/statut', verifierToken, verifierAdmin, updateStatut);
router.delete('/tickets/:id',       verifierToken, verifierAdmin, deleteTicket);

module.exports = router;