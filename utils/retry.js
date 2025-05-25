// utils/retry.js
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Event = require('../models/Event');
const Subscription = require('../models/Subscription');

const MONGO_URI = process.env.MONGO_URI;

async function retryFailedDeliveries() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const failedEvents = await Event.find({ deliveryStatus: 'failed', deliveryAttempts: { $lt: 5 } }).populate('subscription');

  for (const event of failedEvents) {
    try {
      await axios.post(event.subscription.callbackUrl, event.payload, { timeout: 5000 });
      event.deliveryStatus = 'delivered';
      console.log(`Event ${event._id} delivered successfully.`);
    } catch (err) {
      event.deliveryAttempts += 1;
      console.log(`Retry #${event.deliveryAttempts} failed for event ${event._id}.`);
      if (event.deliveryAttempts >= 5) {
        console.log(`Max retries reached for event ${event._id}.`);
      }
    }
    await event.save();
  }

  mongoose.connection.close();
}

retryFailedDeliveries().catch(console.error);
