import React, { useState, useEffect } from 'react';

const SellerProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  console.log(userId); // Check userId

  useEffect(() => {
    // Fetch the current profile from the backend when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/seller/profile/${userId}`, {
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
      const response = await fetch(`/api/seller/update-profile/${userId}`, {
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
      <h2>Seller Profile</h2>
      <div className="profile-field">
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.name || 'No name provided'}</p>
        )}
      </div>

      <div className="profile-field">
        <label>Description:</label>
        {isEditing ? (
          <input
            type="text"
            name="description"
            value={profile.description}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.description || 'No description provided'}</p>
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

export default SellerProfile;
