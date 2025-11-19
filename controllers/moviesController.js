const Movie = require('../models/Movie');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// GET all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate('category');
    const movies = await Movie.find().populate('category');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movies', details: err.message });
  }
};

// GET movie by ID
const getMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const movie = await Movie.findById(id).populate('category');
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movie', details: err.message });
  }
};

// POST create movie
const createMovie = async (req, res) => {
  const { title, director, year, genre, rating, duration, description, category } = req.body;

  if (!title || !director || !year || !genre || !rating || !duration || !description || !category) {
    return res.status(400).json({ error: 'All fields including category are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(category)) return res.status(400).json({ error: 'Invalid category ID' });

  try {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) return res.status(404).json({ error: 'Category not found' });

    const newMovie = new Movie({ title, director, year, genre, rating, duration, description, category });
    const saved = await newMovie.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating movie', details: err.message });
  }
};

// PUT update movie
const updateMovie = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid movie ID' });

  if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  try {
    const updated = await Movie.findByIdAndUpdate(id, updateData, { new: true }).populate('category');
    if (!updated) return res.status(404).json({ error: 'Movie not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating movie', details: err.message });
  }
};

// DELETE movie
const deleteMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid movie ID' });

  try {
    const deleted = await Movie.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting movie', details: err.message });
  }
};


module.exports = {
  // Movies
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
