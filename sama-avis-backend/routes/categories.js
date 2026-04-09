const express = require('express');
const router = express.Router();
const { getAllCategories, createCategorie, deleteCategorie } = require('../Controllers/categorieController');

const { verifierToken, verifierAdmin } = require('../middleware/authMiddleware');

// Routes publiques
router.get('/categories', getAllCategories);

// Routes protégées admin
router.post('/categories',       verifierToken, verifierAdmin, createCategorie);
router.delete('/categories/:id', verifierToken, verifierAdmin, deleteCategorie);

module.exports = router;