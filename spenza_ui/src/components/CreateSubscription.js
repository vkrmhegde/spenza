import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateSubscription() {
  const [source, setSource] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/subscriptions/create', { source, callbackUrl }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    navigate('/subscriptions/read');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={source} onChange={e => setSource(e.target.value)} placeholder="Event name" required />
      <input value={callbackUrl} onChange={e => setCallbackUrl(e.target.value)} placeholder="Target URL" required />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateSubscription;