const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'webhook-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

module.exports = kafka;
