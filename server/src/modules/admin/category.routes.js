const express = require('express');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('./category.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
