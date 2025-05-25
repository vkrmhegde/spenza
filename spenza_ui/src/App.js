import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Subscriptions from './components/Subscriptions';
import CreateSubscription from './components/CreateSubscription';
import Events from './components/Events';
import RealtimeLog from './pages/RealtimeLog';


function App() {
  return (
     <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/subscriptions/read" element={<Subscriptions />} />
      <Route path="/subscriptions/create" element={<CreateSubscription />} />
      <Route path="/webhook/read-events" element={<Events />} />
      <Route path="/realtime-log" element={<RealtimeLog />} />
    </Routes>
  );
}

export default App;
