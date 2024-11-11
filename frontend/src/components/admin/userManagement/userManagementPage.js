// src/components/admin/UserManagement.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagementPage = () => {
  const navigate = useNavigate();

  // Handle navigation to respective pages
  const handleDeleteAccount = () => {
    // Navigate to delete account page or trigger deletion functionality
    navigate('/admin/userManagement/deleteUser');
  };

  const handleAddAdmin = () => {
    // Navigate to add admin page or trigger add admin functionality
    navigate('/admin/userManagement/addAdmin');
  };

  const handleAddTourismGovernor = () => {
    // Navigate to add tourism governor page or trigger add tourism governor functionality
    navigate('/admin/userManagement/addGovernor');
  };

  const handleViewSignupRequests = () => {
    //Navigate to view signup requests
    navigate('/admin/userManagement/viewSignupRequests')
  }

  const handleViewUserNumbers = () => {
    //Navigate to view signup requests
    navigate('/admin/userManagement/viewUserNumbers');
  }

  return (
    <div className="main-content">
      <h1>User Management</h1>
      <div className="card">
        <h3>Manage Users and Admins</h3>
        <div className="button-container">
          <button onClick={handleDeleteAccount}>Delete Account</button>
          <button onClick={handleAddAdmin}>Add Admin</button>
          <button onClick={handleAddTourismGovernor}>Add Tourism Governor</button>
          <button onClick={handleViewSignupRequests}>View Signup Requests</button>
          <button onClick={handleViewUserNumbers}>View No. Of Users</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
