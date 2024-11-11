import React, { useState, useEffect } from 'react';

const TourGuideProfile = () => {
  const [profile, setProfile] = useState({
    mobileNumber: '',
    previousWork: '',
    yearsOfExperience: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  console.log(userId); // Check userId

  useEffect(() => {
    // Fetch the current profile from the backend when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/tourGuide/profile/${userId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.profile); // Assuming data contains profile directly
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (userId) fetchProfile(); // Ensure the userId is available before making the request
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/tourGuide/update-profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile) // Send profile directly without nested structure
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
      setIsEditing(false); // Turn off editing after saving
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  return (
    <div className="profile-container">
      <h2>Tour Guide Profile</h2>
      <div className="profile-field">
        <label>Mobile Number:</label>
        {isEditing ? (
          <input
            type="text"
            name="mobileNumber"
            value={profile.mobileNumber}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.mobileNumber || 'No mobile number provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Previous Work:</label>
        {isEditing ? (
          <input
            type="text"
            name="previousWork"
            value={profile.previousWork}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.previousWork || 'No previous work provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Years of Experience:</label>
        {isEditing ? (
          <input
            type="number"
            name="yearsOfExperience"
            value={profile.yearsOfExperience}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.yearsOfExperience || 'No experience provided'}</p>
        )}
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

export default TourGuideProfile;
