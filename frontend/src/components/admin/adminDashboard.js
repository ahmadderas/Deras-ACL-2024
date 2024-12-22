// src/components/admin/AdminDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // State to manage form visibility and input values
  const [isCreatingPromoCode, setIsCreatingPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  // Navigate to other pages as before
  const handleUserManagement = () => {
    navigate('/admin/userManagement/userManagementPage');
  };

  const handleActivityCategory = () => {
    navigate('/admin/activityCategories');
  };

  const handleTags = () => {
    navigate('/admin/tags');
  };

  const handleEvents = () => {
    navigate('/admin/events');
  };

  const handleViewProducts = () => {
    navigate('/admin/viewProducts');
  };

  const handleViewNotifications = () => {
    navigate('/admin/viewNotifications');
  };

  const handleViewComplaints = () => {
    navigate('/admin/viewComplaints');
  };

  // Handle creating promo code (show form)
  const handleCreatePromoCode = () => {
    setIsCreatingPromoCode(true);
  };

  // Handle promo code input change
  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  // Handle usage limit input change
  const handleUsageLimitChange = (e) => {
    setUsageLimit(e.target.value);
  };
  

  // Submit the new promo code
  const handleSubmitPromoCode = async () => {
    if (!promoCode || !usageLimit) {
      alert('Both fields are required!');
      return;
    }

    try {
      const response = await fetch('/api/admin/create-promocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          usageLimit: usageLimit,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Promo code created successfully!');
        setIsCreatingPromoCode(false);
        setPromoCode('');
        setUsageLimit('');
      } else {
        alert(result.message || 'Error creating promo code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create promo code');
    }
  };

  return (
    <div className="main-content">
      <h1>Admin Dashboard</h1>
      <div className="card">
        <button onClick={handleUserManagement}>User Management</button>
        <button onClick={handleActivityCategory}>Activity Categories</button>
        <button onClick={handleTags}>Tags</button>
        <button onClick={handleEvents}>Events</button>
        <button onClick={handleViewProducts}>View Products</button>
        <button onClick={handleViewNotifications}>View Notifications</button>
        <button onClick={handleCreatePromoCode}>Create Promo Code</button>
        <button onClick={handleViewComplaints}>View Complaints</button>
      </div>

      {/* Promo Code Form */}
      {isCreatingPromoCode && (
        <div className="promo-code-form">
          <h2>Create Promo Code</h2>
          <label>
            Promo Code:
            <input
              type="text"
              value={promoCode}
              onChange={handlePromoCodeChange}
              placeholder="Enter Promo Code"
            />
          </label>
          <br />
          <label>
            Usage Limit:
            <input
              type="number"
              value={usageLimit}
              onChange={handleUsageLimitChange}
              placeholder="Enter Usage Limit"
            />
          </label>
          <br />
          <button onClick={handleSubmitPromoCode}>Create Promo Code</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
