// src/components/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdvertiserDashboard = () => {
  const navigate = useNavigate();

  // Navigate to User Management page when button is clicked
  const handleUpdateProfile = () => {
    navigate('/advertiser/updateProfile');
  };

  const handleActivities = () => {
    navigate('/advertiser/viewActivities');
  };

  const handleNotifications = () => {
    navigate('/advertiser/viewNotifications');
  };

  return (
    <div className="main-content">
      <h1>Advertiser Dashboard</h1>
      <div className="card">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleActivities}>Activities</button>
        <button onClick={handleNotifications}>Notifications</button>
      </div>
      {/* Add more cards or sections as needed */}
    </div>
  );
};

export default AdvertiserDashboard;
