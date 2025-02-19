import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../utils/databaseSchemas.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 80;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Auth server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Error Occurred');
  });

app.use(express.json());

app.post('/auth/login', async (req, res, next) => {
  let { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });

    if (!existingUser)
      return res.status(404).json({ message: 'User not found' });

    if (password !== existingUser.password)
      return res.status(401).json({ message: 'Invalid credentials' });

    let token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      email: existingUser.email,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handling post request
app.post('/auth/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch {
    const error = new Error('Error! Something went wrong.');
    return next(error);
  }

  res.status(201).json({
    userId: newUser._id,
  });
});
