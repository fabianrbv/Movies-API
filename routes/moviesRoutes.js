const express = require('express');
const router = express.Router();
const movies = require('../controllers/moviesController');

router.get('/', movies.getAllMovies);
router.get('/:id', movies.getMovie);
router.post('/', movies.createMovie);
router.put('/:id', movies.updateMovie);
router.delete('/:id', movies.deleteMovie);

module.exports = router;
