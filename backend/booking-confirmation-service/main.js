import mongoose from 'mongoose';
import { Kafka } from 'kafkajs';
import amqp from 'amqplib/callback_api.js';
import AWS from 'aws-sdk';
import { Movie, User } from '../utils/databaseSchemas.js';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-north-1',
});
const lambda = new AWS.Lambda();

//database connection
mongoose.connect(process.env.DATABASE_URL);

//kafka connection
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});

async function startConsumer() {
  const consumer = kafka.consumer({ groupId: 'my-app' });
  await consumer.connect();

  await consumer.subscribe({ topics: ['tickets'], fromBeginning: true });
  amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(async function (error1, channel) {
      if (error1) {
        throw error1;
      }
      let queue = 'notifications';

      channel.assertQueue(queue, {
        durable: false,
      });

      await consumer.run({
        eachMessage: async ({
          topic,
          partition,
          message,
          heartbeat,
          pause,
        }) => {
          const parsedMessage = JSON.parse(message.value.toString());
          const user = await User.findOne({ _id: parsedMessage.userId });
          const movie = await Movie.findOne({ _id: parsedMessage.movieId });
          if (!user || !movie) {
            console.log('Invalid user or movie on the ticket.');
            return;
          }

          const lambdaInput = { user, movie };

          const lambdaResponse = await lambda
            .invoke({
              FunctionName: 'FormatBookingDetails',
              Payload: JSON.stringify({ body: lambdaInput }),
            })
            .promise();

          const parsedPayload = JSON.parse(lambdaResponse.Payload);
          const formattedData = JSON.parse(parsedPayload.body);
          console.log('Lambda response:', formattedData);

          console.log(
            `[${topic}]: PARTITION:${partition}:`,
            message.value.toString()
          );
          channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(formattedData))
          );
          console.log(
            ' [!] Sent ticket to notification %s',
            JSON.stringify(formattedData)
          );
        },
      });
    });
  });
}

startConsumer();
