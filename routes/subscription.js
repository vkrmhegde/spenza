// routes/subscription.js
const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Event = require('../models/Event');

router.use(auth);

// POST /subscriptions - subscribe to a webhook
router.post('/create', async (req, res) => {
  const { source, callbackUrl } = req.body;
  if (!source || !callbackUrl) {
    return res.status(400).json({ error: 'Source and callbackUrl are required' });
  }

  try {
    const subscription = new Subscription({
      user: req.user.id,
      source,
      callbackUrl
    });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: 'Subscription failed', details: err.message });
  }
});

// GET /subscriptions - list all subscriptions of the user
router.get('/read', async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// DELETE /subscriptions/:id - cancel subscription
router.delete('/delete/:id', async (req, res) => {
  try {
    const subscriptionId = req.params.id;

    // Delete the subscription
    const deleted = await Subscription.findOneAndDelete({
      _id: subscriptionId,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Delete related events
    await Event.deleteMany({ subscription: new mongoose.Types.ObjectId(subscriptionId) });

    res.json({ message: 'Subscription and related events deleted' });
  } catch (err) {
    console.error('Error deleting subscription/events:', err);
    res.status(500).json({ error: 'Failed to cancel subscription and delete events' });
  }
});

module.exports = router;
