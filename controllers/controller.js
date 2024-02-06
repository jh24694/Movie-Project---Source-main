import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';
import Movie from '../schema.js';

const app = express();

export const loadHome = async (req, res) => {
  res.render('home', { movieData: null });
};

export const loadData = async (req, res) => {
  try {
    // Aggregate to calculate total number of movies and total times watched
    const [totalMoviesResult, totalTimesWatchedResult] = await Promise.all([
      Movie.countDocuments(),
      Movie.aggregate([
        {
          $group: {
            _id: null,
            totalTimesWatched: { $sum: '$timesWatched' }
          }
        }
      ])
    ]);

    const totalMovies = totalMoviesResult;
    const totalTimesWatched = totalTimesWatchedResult.length > 0 ? totalTimesWatchedResult[0].totalTimesWatched : 0;

    // Fetch your movie data here (assuming you have a function for that)
    const movieData = await Movie.find(); // Replace with your actual function to fetch movie data

    // Render your EJS template with the data
    res.render('data', { movieData, totalMovies, totalTimesWatched });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading data');
  }
};




export const searchMovie = async (req, res) => {
  const searchTerm = req.body.searchInput;

  try {
    if (searchTerm) {
      const response = await fetch(`http://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.APIKEY}`);
      const data = await response.json();

      res.render('home', { movieData: data });
    } else {
      res.render('home', { movieData: null });
    }
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
};

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route handler for handling movie addition
/* app.post('/addmovie', async (req, res) => {
  try {
    const { name, year, photo } = req.body;

    // Create a new movie instance with the provided data
    const newMovie = new Movie({ name, year, photo });

    // Save the new movie to the database
    await newMovie.save();
    res.sendStatus(200); // Send a success response

  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding movie');
  }
}); */

// Function to mark movie as watched
/* export const markAsWatched = async (req, res) => {
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
}; */

export default app; 
