import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();

amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    let queue = 'notifications';

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
    channel.consume(
      queue,
      function (msg) {
        const message = JSON.parse(msg.content.toString());

        console.log(
          'Sending notification for registering movie ticket with following info: user email: %s, user name: %s, movie: %s, location: %s, date: %s, price: %s',
          message.email,
          message.name,
          message.movieTitle,
          message.location,
          message.date,
          message.price
        );
      },
      {
        noAck: true,
      }
    );
  });
});
