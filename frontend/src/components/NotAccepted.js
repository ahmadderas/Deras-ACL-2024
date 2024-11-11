import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotAccepted = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Sorry, you're not accepted yet.</h2>
      <p>Please wait until your account is approved.</p>
      <button onClick={handleHome} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Home
      </button>
    </div>
  );
};

export default NotAccepted;
