import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TouristDashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0); // State to store wallet balance
  const [error, setError] = useState(null); // State to handle errors
  const userId = localStorage.getItem('userId'); // Get userId from local storage

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!userId) {
        setError('User not logged in');
        return;
      }

      try {
        const response = await fetch(`/api/tourist/wallet/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setWalletBalance(data.wallet);
        } else {
          setError(data.message || 'Error fetching wallet balance');
        }
      } catch (err) {
        setError('Server error');
      }
    };

    fetchWalletBalance();
  }, [userId]);

  // Navigation handlers
  const handleUpdateProfile = () => navigate('/tourist/updateProfile');
  const handleViewAll = () => navigate('/tourist/viewAll');
  const handleComment = () => navigate('/tourist/comments');
  const handleSaved = () => navigate('/tourist/viewSaved');
  const handleNotifications = () => navigate('/tourist/viewNotifications');
  const handleViewProducts = () => navigate('/tourist/viewProducts');
  const handleViewWishlist = () => navigate('/tourist/viewWishlist');
  const handleViewCart = () => navigate('/tourist/viewCart');
  const handleViewOrders = () => navigate('/tourist/viewOrders');
  const handleViewComplaints = () => navigate('/tourist/viewComplaints');

  return (
    <div className="main-content">
      {/* Wallet Balance at Top Right */}
      <div className="wallet-balance">
        <strong>Wallet:</strong> <span>${walletBalance}</span>
      </div>

      <h1>Tourist</h1>
      <div className="card">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleViewAll}>Events & Historical Places</button>
        <button onClick={handleComment}>Comment On Complete Events</button>
        <button onClick={handleSaved}>View Saved Events</button>
        <button onClick={handleNotifications}>View Notifications</button>
        <button onClick={handleViewProducts}>View Products</button>
        <button onClick={handleViewWishlist}>Wishlist</button>
        <button onClick={handleViewCart}>Cart</button>
        <button onClick={handleViewOrders}>Your Orders</button>
        <button onClick={handleViewComplaints}>View Complaints</button>
      </div>
    </div>
  );
};

export default TouristDashboard;
