const Movie = require('../models/Movie');

//
// ─── MOVIES CRUD ───────────────────────────────────────────────────────────────
//

// GET all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate('category');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movies' });
  }
};

// GET movie by ID
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('category');
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movie' });
  }
};

// POST create movie
const createMovie = async (req, res) => {
  try {
    const { title, director, year, genre, rating, duration, description, category } = req.body;

    if (!title || !director || !year || !genre || !rating || !duration || !description || !category) {
      return res.status(400).json({ error: 'All fields including category are required' });
    }

    // Validate category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newMovie = new Movie(req.body);
    const saved = await newMovie.save();

    res.status(201).json({ id: saved._id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating movie' });
  }
};

// PUT update movie
const updateMovie = async (req, res) => {
  try {
    // Validate new category if provided
    if (req.body.category) {
      const exists = await Category.findById(req.body.category);
      if (!exists) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Movie not found' });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error updating movie' });
  }
};

// DELETE movie
const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error deleting movie' });
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
