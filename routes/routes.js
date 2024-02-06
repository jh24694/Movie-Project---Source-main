// routes.js

import express from 'express';
import * as controller from './../controllers/controller.js';
import Movie from '../schema.js';  // Importing the Movie model

const router = express.Router();

router.get('/', controller.loadHome);
router.post('/search', controller.searchMovie);
router.get('/data', controller.loadData);
router.post('/markAsWatched', async (req, res) => {
  try {
    const { movieId } = req.body;

    // Find the movie by ID and increment the timesWatched counter
    const movie = await Movie.findById(movieId);
    if (movie) {
      movie.timesWatched += 1;
      await movie.save();
      res.sendStatus(200); // Send a success response
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error marking movie as watched');
  }
});

router.post('/addMovie', async (req, res) => {
  try {
    const { name, year, photo } = req.body;

    // Create a new movie instance with the provided data
    const newMovie = new Movie({ name, year, photo }); // Don't include timesWatched here

    // Save the new movie to the database
    await newMovie.save();
    req.flash('success', 'Movie added successfully!');
    console.log("flash message sent");
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error adding movie');
    res.status(500).send('Error adding movie');
  }
});

router.post('/deleteMovie', async (req, res) => {
    try {
    const { movieId } = req.body;

    // Find the movie by ID and delete it
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    if (deletedMovie) {
      res.sendStatus(200); // Send a success response
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting movie');
  }
});


export default router;
