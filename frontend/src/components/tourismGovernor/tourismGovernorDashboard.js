// src/components/admin/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TourismGovernorDashboard = () => {
  const navigate = useNavigate();

  // Navigate to User Management page when button is clicked
  const handleMuseumHistorical = () => {
    navigate('/tourismGovernor/viewMuseumHistorical');
  };

  const handleHistoricalTags = () => {
    navigate('/tourismGovernor/viewHistoricalTags');
  };

  return (
    <div className="main-content">
      <h1>Tourism Governor Dashboard</h1>
      <div className="card">
        <button onClick={handleMuseumHistorical}>View Museums/Historical Places </button>
        <button onClick={handleHistoricalTags}>View Historical Tags </button>
      </div>
      {/* Add more cards or sections as needed */}
    </div>
  );
};

export default TourismGovernorDashboard;
