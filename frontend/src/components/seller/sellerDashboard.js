// src/components/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const navigate = useNavigate();

  // Navigate to User Management page when button is clicked
  const handleUpdateProfile = () => {
    navigate('/seller/updateProfile');
  };

  const handleProducts = () => {
    navigate('/seller/products');
  };

  const handleViewNotifications = () => {
    navigate('/seller/viewNotifications');
  };

  return (
    <div className="main-content">
      <h1>Seller Dashboard</h1>
      <div className="card">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleProducts}>View Products</button>
        <button onClick={handleViewNotifications}>View Notifications</button>
      </div>
      {/* Add more cards or sections as needed */}
    </div>
  );
};

export default SellerDashboard;
