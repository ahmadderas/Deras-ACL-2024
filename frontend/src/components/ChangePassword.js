// src/components/ChangePassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, currentPassword: oldPassword, newPassword }),
      });
      console.log(username, oldPassword, newPassword);

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert('Password changed successfully!');
      navigate('/'); // Redirect to login page after password change
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
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
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
