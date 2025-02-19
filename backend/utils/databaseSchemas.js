import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('User', userSchema);

export const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
});

export const Movie = mongoose.model('Movie', movieSchema);

export const ticketSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
