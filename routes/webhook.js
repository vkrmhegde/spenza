// routes/webhook.js
const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Event = require('../models/Event');
const axios = require('axios');
const auth = require('../middleware/auth'); 
router.use(auth);

router.post('/create-event', async (req, res) => {
  const { subscriptionId, payload } = req.body;
  if (!subscriptionId || !payload) {
    return res.status(400).json({ error: 'subscriptionId and payload are required' });
  }

  try {
    // Find subscription by source
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'No valid subscription found this subscriptionId' });
    }

    // Create event record
    const event = new Event({
      subscription: subscription._id,
      payload,
      deliveryStatus: 'pending',
    });
    await event.save();

    // Attempt delivery to callbackUrl
    try {
      await axios.post(subscription.callbackUrl, payload, { timeout: 5000 });
      event.deliveryStatus = 'delivered';
    } catch (err) {
      event.deliveryStatus = 'failed';
      event.deliveryAttempts += 1;
    }

    await event.save();

    res.status(201).json({ message: 'Event received', eventId: event._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process webhook event', details: err.message });
  }
});

// GET /webhook/events - Get all webhook events
router.get('/read-events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).populate('subscription');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// DELETE /webhook/events/:id - Delete a specific webhook event
router.delete('/delete-event/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
