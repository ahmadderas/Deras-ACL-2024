import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/advertiser/notifications/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([data]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  

  return (
    <div>
      <h2>Your Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}> {/* Use _id as the key */}
              <p>{notification.description}</p> {/* Display the notification description */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
};

export default Notifications;
