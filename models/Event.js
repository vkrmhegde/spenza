// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  receivedAt: { type: Date, default: Date.now },
  deliveryStatus: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
  deliveryAttempts: { type: Number, default: 0 },
});

module.exports = mongoose.model('Event', eventSchema);
