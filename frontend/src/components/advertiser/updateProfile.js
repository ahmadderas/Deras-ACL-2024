import React, { useState, useEffect } from 'react';

const AdvertiserProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    companyHotline: '',
    companyWebsite: '',
    companyDescription: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    // Fetch the current profile from the backend when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/advertiser/profile/${userId}`, {
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
      const response = await fetch(`/api/advertiser/update-profile/${userId}`, {
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
      <h2>Advertiser Profile</h2>
      <div className="profile-field">
        <label>Company Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.companyName || 'No company name provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Company Hotline:</label>
        {isEditing ? (
          <input
            type="text"
            name="companyHotline"
            value={profile.companyHotline}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.companyHotline || 'No company hotline provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Company Website:</label>
        {isEditing ? (
          <input
            type="text"
            name="companyWebsite"
            value={profile.companyWebsite}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.companyWebsite || 'No company website provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Company Description:</label>
        {isEditing ? (
          <textarea
            name="companyDescription"
            value={profile.companyDescription}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.companyDescription || 'No description provided'}</p>
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

export default AdvertiserProfile;
