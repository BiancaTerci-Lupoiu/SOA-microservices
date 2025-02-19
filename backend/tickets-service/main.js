import express from 'express';
import mongoose from 'mongoose';
import { Movie, Ticket } from '../utils/databaseSchemas.js';
import { Kafka } from 'kafkajs';
import cors from 'cors';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 80;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);

mongoose.connect(process.env.DATABASE_URL);

//kafka connection
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});

//init kafka
async function init() {
  const admin = kafka.admin();
  console.log('Admin connecting...');
  admin.connect();
  console.log('Admin Connection Success...');

  console.log('Creating Topic Tickets');
  await admin.createTopics({
    topics: [
      {
        topic: 'tickets',
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });
  console.log('Topic Created Success tickets');

  console.log('Disconnecting Admin..');
  await admin.disconnect();
}

await init();

//connect producer to kafka
const producer = kafka.producer();

console.log('Connecting Producer');
await producer.connect();
console.log('Producer Connected Successfully');

app.use(express.json());

app.options('/tickets/:movieId', async (req, res) => {
  res.status(200).send('');
});

app.post('/tickets/:movieId', authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const ticket = new Ticket({ movieId: movie._id, userId: req.userId });
    await ticket.save();

    await producer.send({
      topic: 'tickets',
      messages: [
        {
          partition: 0,
          key: 'new ticket',
          value: JSON.stringify(ticket),
        },
      ],
    });

    res.status(200).json({ ticket: ticket, movie: movie });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'User not authenticated' });
  }
});

app.listen(port, () => {
  console.log(`Tickets service listening on port ${port}`);
});
