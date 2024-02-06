// app.js

import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.js';  // Adjust the import path
import mongoose from 'mongoose';

import session from 'express-session';
import flash from 'connect-flash';

dotenv.config({ path: 'process.env' });

const app = express();
const port = 3000;

// Body-parser setup (Express now includes this functionality)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express-session setup
app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: false
}));

// Connect-flash setup
app.use(flash());

// Middleware to make flash messages available to all views
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});


app.set('view engine', 'ejs');


app.use('/', routes);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
