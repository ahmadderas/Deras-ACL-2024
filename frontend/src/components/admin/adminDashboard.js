// src/components/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Navigate to User Management page when button is clicked
  const handleUserManagement = () => {
    navigate('/admin/userManagement/userManagementPage');
  };

  const handleActivityCategory = () => {
    navigate('/admin/activityCategories');
  }

  const handleTags = () => {
    navigate('/admin/tags');
  }

  const handleEvents = () => {
    navigate('/admin/events');
  }

  return (
    <div className="main-content">
      <h1>Admin Dashboard</h1>
      <div className="card">
        <button onClick={handleUserManagement}>User Management</button>
        <button onClick={handleActivityCategory}>Activity Categories</button>
        <button onClick={handleTags}>Tags</button>
        <button onClick={handleEvents}>Events</button>
      </div>
      {/* Add more cards or sections as needed */}
    </div>
  );
};

export default AdminDashboard;
