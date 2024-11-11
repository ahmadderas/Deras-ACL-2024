// src/components/AcceptTerms.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AcceptTerms = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const handleAcceptTerms = async () => {
    try {
      const response = await fetch('/api/auth/accept-terms', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ userId }), // Send the userId to the backend
      });

      if (!response.ok) throw new Error('Failed to update terms acceptance.');

      alert("You're ready to go! Please log in again.");
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Error accepting terms:', error);
      alert('There was an error. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }} >
      <h2>Terms and Conditions</h2>
      <p>By using this website, you agree to the following terms:</p>
      <ul>
        <li>Acceptance of Terms</li>
        <li>User Eligibility</li>
        <li>Account Responsibilities</li>
        <li>Content Guidelines</li>
        <li>Booking and Payment</li>
        <li>Privacy and Data Use</li>
        <li>Limitations of Liability</li>
        <li>Changes to Terms</li>
      </ul>
      <button onClick={handleAcceptTerms}>Accept Terms</button>
    </div>
  );
};

export default AcceptTerms;
