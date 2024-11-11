import React, { useEffect, useState } from 'react';
//import '.index.css'; 

const DeleteUser = () => {
  const [data, setData] = useState({ tourists: [], workers: [], governors: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/view-users');
        if (!response.ok) throw new Error('Error fetching users');
        const data = await response.json();
        setData(data);  // Use the structured data directly
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle deletion function (remains the same)
  const handleDelete = async (type, id) => {
    try {
      const response = await fetch(`/api/admin/delete-user/${type}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting user');

      setData((prevData) => ({
        ...prevData,
        [type]: prevData[type].filter((user) => user._id !== id),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="center-container">
      <h2>Delete Accounts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Tourists</h3>
      <ul>
        {data.tourists && data.tourists.map((tourist) => (
          <li key={tourist._id}>
            {tourist.username} - {tourist.email} - {tourist.occupation}
            <button onClick={() => handleDelete('tourists', tourist._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Workers</h3>
      <ul>
        {data.workers && data.workers.map((worker) => (
          <li key={worker._id}>
            {worker.username} - {worker.email} - {worker.role}
            <button onClick={() => handleDelete('workers', worker._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Tourism Governors</h3>
      <ul>
        {data.governors && data.governors.map((governor) => (
          <li key={governor._id}>
            {governor.username}
            <button onClick={() => handleDelete('governors', governor._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteUser;
