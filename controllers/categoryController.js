const Category = require('../models/Category');


//
// ─── CATEGORIES CRUD ───────────────────────────────────────────────────────────
//

// GET all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

// GET category by ID
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};

// POST create category
const createCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const newCategory = new Category({ name: req.body.name });
    const saved = await newCategory.save();

    res.status(201).json({ id: saved._id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

// PUT update category
const updateCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ error: 'Category not found' });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

// DELETE category
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

module.exports = {
  // Categories
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};