// schema.js

import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  name: String,
  year: Number,
  photo: String,
  timesWatched: { type: Number, default: 0 } // Default value of 0 for timesWatched
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
