const Category = require('../models/Category');
const mongoose = require('mongoose');

// GET all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories', details: err.message });
  }
};

// GET category by ID
const getCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching category', details: err.message });
  }
};

// POST create category
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim() === "") {
  return res.status(400).json({ error: "Category name must be a non-empty string" });
}

  try {
    const newCategory = new Category({ name });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating category', details: err.message });
  }
};

// PUT update category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating category', details: err.message });
  }
};

// DELETE category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting category', details: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
