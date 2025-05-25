import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/subscriptions/read">View Subscriptions</Link>
      <br />
      <Link to="/subscriptions/create">Create Subscription</Link>
      <br /><br />
       <Link to="/webhook/read-events">View Events</Link>
       <br />
       <Link to="/realtime-log">Event logs</Link>
    </div>
  );
}

export default Dashboard;