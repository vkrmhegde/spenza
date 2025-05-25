// kafka/producer.js
const kafka = require('./kafkaClient');

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected');
  } catch (err) {
    console.error('❌ Error connecting Kafka producer:', err);
  }
};

const sendEvent = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`📤 Event sent to topic "${topic}"`);
  } catch (err) {
    console.error(`❌ Failed to send event to topic "${topic}":`, err);
  }
};

module.exports = { connectProducer, sendEvent };
