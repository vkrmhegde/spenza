import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [source, setSource] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('http://localhost:3000/subscriptions/read', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
      setError('Could not load subscriptions');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/subscriptions/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSubscriptions();
    } catch (err) {
      console.error('Failed to cancel subscription', err);
    }
  };

  return (
    <div>

      <h3>Existing Subscriptions:</h3>
      <ul>
        {subscriptions.map((sub) => (
          <li key={sub._id}>
            <strong>{sub.source}</strong> - {sub.callbackUrl}
            <button onClick={() => handleDelete(sub._id)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Subscription;
