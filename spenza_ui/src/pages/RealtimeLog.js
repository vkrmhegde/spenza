import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['polling'],
});

const RealtimeLog = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Listen for new events
    socket.on('new_event', (event) => {
      console.log('Received event:', event);
      setEvents((prev) => [event, ...prev]);
    });

    // Optional: clean up socket on unmount
    return () => {
      socket.off('new_event');
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Webhook Events</h2>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul>
          {events.map((event, idx) => (
            <li key={idx}>
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RealtimeLog;
