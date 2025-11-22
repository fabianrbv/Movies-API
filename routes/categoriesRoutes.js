const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { ensureAuth } = require('../middlewares/auth');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);

router.post('/', ensureAuth, categoryController.createCategory);
router.put('/:id', ensureAuth, categoryController.updateCategory);
router.delete('/:id', ensureAuth, categoryController.deleteCategory);

module.exports = router;
