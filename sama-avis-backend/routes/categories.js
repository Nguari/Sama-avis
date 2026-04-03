const express = require('express');
const router = express.Router();
const { getAllCategories, createCategorie, deleteCategorie } = require('../Controllers/categorieController');

// Toutes les catégories
router.get('/categories', getAllCategories);

// Ajouter une catégorie
router.post('/categories', createCategorie);

// Supprimer une catégorie
router.delete('/categories/:id', deleteCategorie);

module.exports = router;