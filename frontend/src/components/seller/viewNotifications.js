// src/components/ViewNotifications.js

import React, { useState, useEffect } from 'react';

const SellerViewNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get the userId from localStorage

        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        // Use fetch to make the request with userId
        const response = await fetch(`/api/admin/notifications/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);  // Set the notifications to the state
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();  // Call the function to fetch notifications
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <p>{notification.description}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerViewNotifications;
