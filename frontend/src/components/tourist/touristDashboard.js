// src/components/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TouristDashboard = () => {
  const navigate = useNavigate();

  // Navigate to User Management page when button is clicked
  const handleUpdateProfile = () => {
    navigate('/tourist/updateProfile');
  };

  const handleViewAll = () => {
    navigate('/tourist/viewAll');
  };

  const handleComment = () => {
    navigate('/tourist/comments');
  };

  const handleSaved = () => {
    navigate('/tourist/viewSaved');
  };

  const handleNotifications = () => {
    navigate('/tourist/viewNotifications');
  };



  return (
    <div className="main-content">
      <h1>Tourist</h1>
      <div className="card">
        <button onClick={handleUpdateProfile}>Update Profile </button>
        <button onClick={handleViewAll}>Events & Historical Places </button>
        <button onClick={handleComment}>Comment On Complete Events </button>
        <button onClick={handleSaved}>View Saved Events </button>
        <button onClick={handleNotifications}>View Notifications </button>
      </div>
      {/* Add more cards or sections as needed */}
    </div>
  );
};

export default TouristDashboard;
