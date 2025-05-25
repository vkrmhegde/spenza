import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/webhook/read-events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Webhook Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <div><strong>Subscription ID:</strong> {event.subscription._id}</div>
            <div><strong>Source:</strong> {event.subscription.source}</div>
            <div><strong>Callback URL:</strong> {event.subscription.callbackUrl}</div>
            <div><strong>Status:</strong> {event.deliveryStatus}</div>
            <div><strong>Attempts:</strong> {event.deliveryAttempts}</div>
            <div><strong>Received At:</strong> {new Date(event.receivedAt).toLocaleString()}</div>
            <div><strong>Payload:</strong> <pre>{JSON.stringify(event.payload, null, 2)}</pre></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
