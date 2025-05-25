// models/WebhookEvent.js

const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  source: { type: String, required: true },
  payload: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
