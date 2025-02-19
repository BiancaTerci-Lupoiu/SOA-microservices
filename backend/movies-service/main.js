import express from 'express';
import mongoose from 'mongoose';
import { Movie } from '../utils/databaseSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const app = express();
const port = 80;

mongoose.connect(process.env.DATABASE_URL);

app.listen(port, () => {
  console.log(`Movie service listening on port ${port}`);
});

app.use(express.json());

const m1 = new Movie({
  title: 'Fast & Furious 5',
  location: 'Cluj-Napoca',
  date: new Date(),
  price: 30,
});
m1.save().then(() => console.log('Saved movie 1'));
const m2 = new Movie({
  title: 'Annabelle 2',
  location: 'Brasov',
  date: new Date(),
  price: 20,
});
m2.save().then(() => console.log('Saved movie 2'));

app.get('/movies', authMiddleware, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
