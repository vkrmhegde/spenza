// kafka/consumer.js

const { Kafka } = require('kafkajs');
const WebhookEvent = require('../models/WebhookEvent'); // MongoDB model to store events

const kafka = require('./kafkaClient');
const consumer = kafka.consumer({ groupId: 'webhook-group' });

async function connectConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'webhook-events', fromBeginning: true });

  console.log('Kafka consumer connected and listening to topic: webhook-events');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const eventData = JSON.parse(message.value.toString());
        console.log('Received Webhook Event:', eventData);

        // Store in MongoDB
        await WebhookEvent.create({
          source: eventData.source,
          payload: eventData.payload,
          receivedAt: new Date(),
        });

        console.log('Event stored in MongoDB');
      } catch (error) {
        console.error('Error processing event:', error);
        // Optional: implement retry logic or dead letter queue here
      }
    },
  });
}

module.exports = { connectConsumer };
