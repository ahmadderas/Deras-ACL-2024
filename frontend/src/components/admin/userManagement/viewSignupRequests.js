import React, { useEffect, useState } from 'react';

const ViewSignupRequests = () => {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch('/api/admin/view-signup-requests');
        if (!response.ok) throw new Error('Error retrieving signup requests');
        const data = await response.json();
        setWorkers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchWorkers();
  }, []);

  // Accept a worker
  const handleAccept = async (id) => {
    try {
      const response = await fetch(`/api/admin/view-signup-requests/accept/${id}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Error accepting worker');
      
      // Update the workers state by removing the accepted worker
      setWorkers((prevWorkers) =>
        prevWorkers.filter((worker) => worker._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Reject a worker
  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/admin/view-signup-requests/reject/${id}`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Error rejecting worker');
      
      // Update the workers state by removing the rejected worker
      setWorkers((prevWorkers) =>
        prevWorkers.filter((worker) => worker._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Signup Requests</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {workers.map((worker) => (
          <li key={worker._id}>
            {worker.username} - {worker.role} - {worker.email} - {worker.documents}
            <button onClick={() => handleAccept(worker._id)} style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}>
              Accept
            </button>
            <button onClick={() => handleReject(worker._id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewSignupRequests;
