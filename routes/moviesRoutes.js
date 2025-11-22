const express = require('express');
const router = express.Router();
const movies = require('../controllers/moviesController');
const { ensureAuth } = require('../middlewares/auth');

router.get('/', movies.getAllMovies);
router.get('/:id', movies.getMovie);

router.post('/', ensureAuth, movies.createMovie);
router.put('/:id', ensureAuth, movies.updateMovie);
router.delete('/:id', ensureAuth, movies.deleteMovie);

module.exports = router;
