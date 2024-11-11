import React, { useState, useEffect } from 'react';

const TouristProfileComponent = () => {
  const [touristData, setTouristData] = useState({
    email: '',
    DOB: '', // Keep DOB as plain text
    mobileNumber: '',
    occupation: '',
    nationality: '',
    username: '',
    wallet: 0,
    jobOrStudent: '', // New state to manage Job or Student selection
    jobTitle: '', // New state to manage Job Title
  });

  const [formData, setFormData] = useState({
    email: '',
    mobileNumber: '',
    occupation: '',
    nationality: '',
    jobOrStudent: '', // New field to handle Job or Student
    jobTitle: '', // New field to handle Job Title
  });

  const [isEditing, setIsEditing] = useState(false);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');
  console.log(userId);

  useEffect(() => {
    // Fetch tourist profile when the component mounts
    const fetchTouristProfile = async () => {
      try {
        const response = await fetch(`/api/tourist/update-profile/${userId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Error fetching profile');
        }

        const data = await response.json();
        setTouristData(data);
        setFormData({
          email: data.email,
          mobileNumber: data.mobileNumber,
          occupation: data.occupation,
          nationality: data.nationality,
          jobOrStudent: data.occupation === 'Student' ? 'Student' : 'Job', // Set based on fetched data
          jobTitle: data.occupation !== 'Student' ? data.occupation : '', // If Job, set jobTitle
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) fetchTouristProfile(); // Ensure userId is available before fetching
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'jobOrStudent') {
      // Handle occupation change based on Job or Student selection
      if (value === 'Student') {
        setFormData((prevData) => ({
          ...prevData,
          jobTitle: '', // Clear job title if Student is selected
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      const occupation = formData.jobOrStudent === 'Student' ? 'Student' : formData.jobTitle;

      const updatedFormData = { ...formData, occupation };

      const response = await fetch(`/api/tourist/update-profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData), // Send updated form data to backend
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setTouristData(updatedData);
      setIsEditing(false); // Turn off editing after saving
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  return (
    <div className="profile-container">
      <h2>Tourist Profile</h2>

      <div className="profile-field">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        ) : (
          <p>{touristData.email || 'No email provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Date of Birth:</label>
        <p>{touristData.DOB || 'No date of birth provided'}</p>
      </div>

      <div className="profile-field">
        <label>Mobile Number:</label>
        {isEditing ? (
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        ) : (
          <p>{touristData.mobileNumber || 'No mobile number provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Occupation:</label>
        {isEditing ? (
          <>
            <select
              name="jobOrStudent"
              value={formData.jobOrStudent}
              onChange={handleChange}
            >
              <option value="Job">Job</option>
              <option value="Student">Student</option>
            </select>

            {formData.jobOrStudent === 'Job' && (
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            )}
          </>
        ) : (
          <p>{touristData.occupation || 'No occupation provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Nationality:</label>
        {isEditing ? (
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        ) : (
          <p>{touristData.nationality || 'No nationality provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Username:</label>
        <p>{touristData.username || 'No username provided'}</p>
      </div>

      <div className="profile-field">
        <label>Wallet Balance:</label>
        <p>{touristData.wallet || 0}</p>
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default TouristProfileComponent;
