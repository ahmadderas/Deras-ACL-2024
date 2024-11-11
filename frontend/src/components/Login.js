// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      alert('Login successful!');

      const { role, accepted, termsAccepted } = data;
      localStorage.setItem('userId', data.userId);
      console.log("Role:", role, "accepted:", accepted, "termsAccepted:", termsAccepted); // Log individual values

      // Redirect based on role
      switch (role) {
        case 'Admin':
          navigate('/admin/adminDashboard');
          break;
        case 'Tourist':
            navigate('/tourist/touristDashboard');
          break;
        case 'Seller':
          if(accepted && termsAccepted)
            navigate('/seller/sellerDashboard');
          if(!accepted)
            navigate('/notAccepted');
          if(accepted && !termsAccepted)
            navigate('/acceptTerms');
          break;
        case 'Advertiser':
          if(accepted && termsAccepted)
            navigate('/advertiser/advertiserDashboard');
          if(!accepted)
            navigate('/notAccepted');
          if(accepted && !termsAccepted)
            navigate('/acceptTerms');
          break;
        case 'Tour Guide':
          if(accepted && termsAccepted)
            navigate('/tourGuide/tourGuideDashboard');
          if(!accepted)
            navigate('/notAccepted');
          if(accepted && !termsAccepted)
            navigate('/acceptTerms');
          break;
        case 'Tourism Governor':
          navigate('/tourismGovernor/tourismGovernorDashboard');
          break;

        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTouristSignUp = () => {
    navigate('/signup/tourist'); // Redirect to tourist sign-up page
  };

  const handleWorkerSignUp = () => {
    navigate('/signup/worker'); // Redirect to worker sign-up page
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword'); // Redirect to change password page
  };

  const handleForgotPassword = () => {
    navigate('/ForgotPassword'); // Redirect to change password page
  };

  const handleDemo = () => {
    navigate('/TourSystemDemo'); // Redirect to change password page
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleTouristSignUp}>Sign Up as a Tourist</button>
      <button onClick={handleWorkerSignUp}>Sign Up as a Tour Guide/Advertiser/Seller</button>
      <button onClick={handleChangePassword}>Change Password</button>
      <button onClick={handleForgotPassword}>Forgot Password?</button>
      <button onClick={handleDemo}>Tourist Demo</button>
    </div>
  );
};

export default Login;
