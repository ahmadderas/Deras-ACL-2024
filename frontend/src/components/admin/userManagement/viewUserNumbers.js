// components/UserStats.js
import React, { useEffect, useState } from 'react';

const UserStats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerMonth, setUsersPerMonth] = useState([]);

  useEffect(() => {
    // Fetch user statistics from the API
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/admin/user-stats'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTotalUsers(data.totalUsers);
        setUsersPerMonth(data.usersPerMonth);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div>
      <h2>User Statistics</h2>
      <p>Total Users: {totalUsers}</p>
      <h3>Users Per Month:</h3>
      <ul>
        {usersPerMonth.map((item, index) => (
          <li key={index}>
            Month {item._id}: {item.count} users
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserStats;
