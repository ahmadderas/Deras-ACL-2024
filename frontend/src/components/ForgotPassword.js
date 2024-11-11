import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Tourist'); // Default role selection
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }), // Include role in the request
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage('OTP sent to your email.');
      setStep(2);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, role }), // Include role in the request
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage('OTP verified. You may now reset your password.');
      setStep(3);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, role }), // Include role in the request
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage('Password reset successfully.');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}

      {step === 1 && (
        <>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Tourist">Tourist</option>
            <option value="Tour Guide">Tour Guide</option>
            <option value="Seller">Seller</option>
            <option value="Advertiser">Advertiser</option>
          </select>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendEmail}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
