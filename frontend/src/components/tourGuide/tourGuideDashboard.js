// src/components/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourGuideDashboard = () => {
  const navigate = useNavigate();

  // Navigate to User Management page when button is clicked
  const handleUpdateProfile = () => {
    navigate('/tourGuide/updateProfile');
  };

  const handleItineraries = () => {
    navigate('/tourGuide/viewItineraries');
  };

  const handleNotifications = () => {
    navigate('/tourGuide/viewNotifications');
  };

  return (
    <div className="main-content">
      <h1>Tour Guide Dashboard</h1>
      <div className="card">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleItineraries}>Itineraries</button>
        <button onClick={handleNotifications}>Notifications</button>
      </div>
      {/* Add more cards or sections as needed */}
    </div>
  );
};

export default TourGuideDashboard;
