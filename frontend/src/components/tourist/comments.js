import React, { useState, useEffect } from 'react';

const Comments = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [formData, setFormData] = useState({});

  const userId = localStorage.getItem('userId');

  // Fetch activities and itineraries
  useEffect(() => {
    fetch(`/api/tourist/comments/${userId}`)
      .then(response => response.json())
      .then(data => {
        setActivities(data.activities);
        setItineraries(data.itineraries);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [userId]);

  // Handle input change for form fields
  const handleInputChange = (e, id, field) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: e.target.value }
    }));
  };

  // Handle submit for both Tour Guide and Advertiser comments/ratings
  const handleSubmit = (e, id, type, role) => {
    e.preventDefault();
    const commentField = role === 'advertiser' ? 'advertiserComment' : 'tourGuideComment';
    const ratingField = role === 'advertiser' ? 'advertiserRating' : 'tourGuideRating';

    const { [commentField]: comment, [ratingField]: rating } = formData[id] || {};

    fetch('/api/tourist/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: id,
        type,
        comment,
        rating: parseFloat(rating),
        role
      })
    })
      .then(response => response.json())
      .then(data => console.log('Comment and rating added:', data))
      alert('Comment/Rating added successfully')
  };

  return (
    <div>
      <h2>Activities</h2>
      {activities.map(activity => (
        <div key={activity._id}>
          <h3>{activity.name}</h3>

          {/* Tour Guide Comment and Rating */}
          <form onSubmit={e => handleSubmit(e, activity._id, 'activity', 'tourGuide')}>
            <input
              type="text"
              placeholder="Event Comment"
              value={formData[activity._id]?.tourGuideComment || ''}
              onChange={e => handleInputChange(e, activity._id, 'eventComment')}
            />
            <input
              type="number"
              placeholder="Event Rating"
              value={formData[activity._id]?.tourGuideRating || ''}
              onChange={e => handleInputChange(e, activity._id, 'eventRating')}
            />
            <button type="submit">Submit Event Comment & Rating</button>
          </form>

          {/* Advertiser Comment and Rating */}
          <form onSubmit={e => handleSubmit(e, activity._id, 'activity', 'advertiser')}>
            <input
              type="text"
              placeholder="Advertiser Comment"
              value={formData[activity._id]?.advertiserComment || ''}
              onChange={e => handleInputChange(e, activity._id, 'advertiserComment')}
            />
            <input
              type="number"
              placeholder="Advertiser Rating"
              value={formData[activity._id]?.advertiserRating || ''}
              onChange={e => handleInputChange(e, activity._id, 'advertiserRating')}
            />
            <button type="submit">Submit Advertiser Comment & Rating</button>
          </form>
        </div>
      ))}

      <h2>Itineraries</h2>
      {itineraries.map(itinerary => (
        <div key={itinerary._id}>
          <h3>{itinerary.timeline}</h3>

          {/* Tour Guide Comment and Rating */}
          <form onSubmit={e => handleSubmit(e, itinerary._id, 'itinerary', 'tourGuide')}>
            <input
              type="text"
              placeholder="Event Comment"
              value={formData[itinerary._id]?.tourGuideComment || ''}
              onChange={e => handleInputChange(e, itinerary._id, 'eventComment')}
            />
            <input
              type="number"
              placeholder="Event Rating"
              value={formData[itinerary._id]?.tourGuideRating || ''}
              onChange={e => handleInputChange(e, itinerary._id, 'Event Rating')}
            />
            <button type="submit">Submit Event Comment & Rating</button>
          </form>

          {/* Advertiser Comment and Rating */}
          <form onSubmit={e => handleSubmit(e, itinerary._id, 'itinerary', 'advertiser')}>
            <input
              type="text"
              placeholder="Tour Guide Comment"
              value={formData[itinerary._id]?.advertiserComment || ''}
              onChange={e => handleInputChange(e, itinerary._id, 'tourGuideComment')}
            />
            <input
              type="number"
              placeholder="Tour Guide Rating"
              value={formData[itinerary._id]?.advertiserRating || ''}
              onChange={e => handleInputChange(e, itinerary._id, 'tourGuideRating')}
            />
            <button type="submit">Submit Tour Guide Comment & Rating</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default Comments;
