// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },        // URL or source identifier
  callbackUrl: { type: String, required: true },   // URL where events should be sent
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
