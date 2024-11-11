import React, { useState, useEffect } from 'react';

const ActivityComponent = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    price: '',
    category: '',
    tags: [],
    specialDiscounts: '',
    isBookingOpen: true,
  });
  const [editActivity, setEditActivity] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch activities from the backend
    const fetchActivities = async () => {
      const response = await fetch(`/api/advertiser/activities/${userId}`);
      const data = await response.json();
      setActivities(data);
    };

    // Fetch categories and tags from the backend
    const fetchCategoriesAndTags = async () => {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/admin/activity-categories'),
        fetch('/api/admin/tags'),
      ]);

      const categoriesData = await categoriesRes.json();
      const tagsData = await tagsRes.json();

      setCategories(categoriesData);
      setTags(tagsData);
    };

    fetchActivities();
    fetchCategoriesAndTags();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagToggle = (tagId) => {
    setNewActivity((prevState) => {
      const tags = prevState.tags.includes(tagId)
        ? prevState.tags.filter((id) => id !== tagId) // Remove tag if already selected
        : [...prevState.tags, tagId]; // Add tag if not already selected

      return { ...prevState, tags };
    });
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
  
    // Ensure no empty strings are in the tags array
    const sanitizedTags = newActivity.tags.filter(tag => tag !== '');
  
    const response = await fetch(`/api/advertiser/activities/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newActivity,
        tags: sanitizedTags // Use the sanitized tags array
      }),
    });
  
    const data = await response.json();
    if (response.ok) {
      setActivities([...activities, data]);
      setNewActivity({
        name: '',
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        tags: [],
        specialDiscounts: '',
        isBookingOpen: true,
      });
    } else {
      console.error(data);
    }
  };
  

  const handleEditActivity = (activity) => {
    setEditActivity(activity);
    setNewActivity({
      ...activity,
      date: activity.date.split(' ')[0], // Extract date part
      time: activity.date.split(' ')[1], // Extract time part
    });
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/advertiser/activities/${editActivity._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newActivity),
    });

    const data = await response.json();
    if (response.ok) {
      setActivities(
        activities.map((activity) =>
          activity._id === editActivity._id ? data : activity
        )
      );
      setEditActivity(null);
      setNewActivity({
        name: '',
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        tags: [],
        specialDiscounts: '',
        isBookingOpen: true,
      });
    } else {
      console.error(data);
    }
  };

  const handleDeleteActivity = async (id) => {
    const response = await fetch(`/api/advertiser/activities/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setActivities(activities.filter((activity) => activity._id !== id));
    } else {
      console.error('Error deleting activity');
    }
  };

  return (
    <div>
      <h2>Activities</h2>

      {/* Display list of activities */}
      <div>
        {activities.map((activity) => (
          <div key={activity._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>{activity.name}</h3>
            <p><strong>Name:</strong> {activity.name}</p>
            <p><strong>Category:</strong> {activity.category ? activity.category.name : 'N/A'}</p>
            <p><strong>Tags:</strong> {activity.tags && activity.tags.length > 0 ? activity.tags.map(tag => tag.name).join(', ') : 'N/A'}</p>
            <p><strong>Date & Time:</strong> {new Date(activity.date).toLocaleString()}</p>
            <p><strong>Price:</strong> ${activity.price}</p>
            <p><strong>Location:</strong> {activity.location}</p>
            <p><strong>Open/Closed for booking:</strong> {activity.isBookingOpen ? 'Open' : 'Closed'}</p>
            <p><strong>Special Discounts:</strong> {activity.specialDiscounts || 'N/A'}</p>
            <button onClick={() => handleEditActivity(activity)}>Edit</button>
            <button onClick={() => handleDeleteActivity(activity._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Form to create or edit activity */}
      <h3>{editActivity ? 'Edit Activity' : 'Create Activity'}</h3>
      <form onSubmit={editActivity ? handleUpdateActivity : handleCreateActivity}>
        <input
          type="text"
          name="name"
          value={newActivity.name}
          onChange={handleInputChange}
          placeholder="Activity Name"
        />
        <input
          type="date"
          name="date"
          value={newActivity.date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="time"
          value={newActivity.time}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          value={newActivity.location}
          onChange={handleInputChange}
          placeholder="Location"
        />
        <input
          type="number"
          name="price"
          value={newActivity.price}
          onChange={handleInputChange}
          placeholder="Price"
        />
        
        <select name="category" value={newActivity.category} onChange={handleInputChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <div>
          <h4>Select Tags:</h4>
          {tags.map((tag) => (
            <label key={tag._id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                value={tag._id}
                checked={newActivity.tags.includes(tag._id)}
                onChange={() => handleTagToggle(tag._id)}
              />
              {tag.name}
            </label>
          ))}
        </div>

        <input
          type="text"
          name="specialDiscounts"
          value={newActivity.specialDiscounts}
          onChange={handleInputChange}
          placeholder="Special Discounts"
        />

        <label>
          Booking Open:
          <input
            type="checkbox"
            name="isBookingOpen"
            checked={newActivity.isBookingOpen}
            onChange={(e) => setNewActivity({ ...newActivity, isBookingOpen: e.target.checked })}
          />
        </label>

        <button type="submit">{editActivity ? 'Save Changes' : 'Create Activity'}</button>
      </form>
    </div>
  );
};

export default ActivityComponent;
