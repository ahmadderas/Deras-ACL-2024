// src/components/TouristSignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TouristSignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [dob, setDob] = useState('');
  const [jobOrStudent, setJobOrStudent] = useState('');
  const [jobTitle, setJobTitle] = useState(''); // State for job title
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your tourist sign-up logic here
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, mobileNumber, nationality, dob, jobOrStudent, jobTitle, role: 'Tourist', role2: 'Tourist' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert('Tourist registration successful!');
      navigate('/');
      // Optionally redirect or clear the form
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJobOrStudentChange = (e) => {
    setJobOrStudent(e.target.value);
    if (e.target.value === 'Job') {
      setJobTitle(''); // Clear job title when switching to student
    }
  };

  return (
    <div>
      <h2>Sign Up as a Tourist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <select
          value={jobOrStudent}
          onChange={handleJobOrStudentChange}
          required
        >
          <option value="" disabled>Select Job or Student</option>
          <option value="Job">Job</option>
          <option value="Student">Student</option>
        </select>
        {/* Conditionally render the job title field if 'Job' is selected */}
        {jobOrStudent === 'Job' && (
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default TouristSignUp;
