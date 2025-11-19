const Movie = require('../models/Movie');

// GET all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movies' });
  }
};

// GET movie by ID
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movie' });
  }
};

// POST create movie
const createMovie = async (req, res) => {
  try {
    const { title, director, year, genre, rating, duration, description } = req.body;

    if (!title || !director || !year || !genre || !rating || !duration || !description) {
      return res.status(400).json({ error: 'All fields are required' });
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
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
};
