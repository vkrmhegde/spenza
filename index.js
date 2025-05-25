require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Store the io object
app.set('io', io);

// Routes
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const webhookRoutes = require('./routes/webhook');
const { connectConsumer } = require('./kafka/consumer');

// API endpoints
app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/webhook', webhookRoutes);

// Example event route
app.post('/webhook/create-event', async (req, res) => {
  const { subscriptionId, payload } = req.body;
  const io = req.app.get('io');

  const event = await new Event({ subscription: subscriptionId, payload }).save();
  
  io.emit('new_event', event); // this must match frontend `socket.on('new_event')`
  
  res.json({ message: 'Event received' });
});
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});
// MongoDB + Kafka + start server
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');

  connectConsumer().catch(err => console.error('Kafka Consumer Error:', err));

  server.listen(port, () => console.log(`Server running with Socket.IO on port ${port}`));
})
.catch(err => console.error('MongoDB connection error:', err));
