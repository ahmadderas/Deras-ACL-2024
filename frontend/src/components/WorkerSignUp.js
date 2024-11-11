// src/components/WorkerSignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerSignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!file) {
      setError('Please upload the required documents.');
      return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password, file, role, role2: 'Worker' }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        alert('Worker registration successful!');
        navigate('/');
        // Optionally redirect or clear the form
      } catch (err) {
        setError(err.message);
      }
    };

      

  return (
    <div>
      <h2>Sign Up as a Worker</h2>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled>Select Worker Type</option>
          <option value="Tour Guide">Tour Guide</option>
          <option value="Advertiser">Advertiser</option>
          <option value="Seller">Seller</option>
        </select>

        {/* Conditional message and file input based on worker type */}
        {role === 'Tour Guide' && (
          <>
            <p>Please upload your ID and certificate.</p>
            <input type="file" onChange={handleFileChange} required />
          </>
        )}
        {(role === 'Advertiser' || role === 'Seller') && (
          <>
            <p>Please upload your ID and taxation registry card.</p>
            <input type="file" onChange={handleFileChange} required />
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default WorkerSignUp;
