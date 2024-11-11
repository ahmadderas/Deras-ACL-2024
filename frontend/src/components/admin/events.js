import React, { useEffect, useState } from 'react';

const Events = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch activities and itineraries from the backend
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/activitiesItineraries'); // Adjust this to match your endpoint for fetching both
      const data = await response.json();
      setActivities(data.activities);
      setItineraries(data.itineraries);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle flagging as inappropriate
  const handleFlagAsInappropriate = async (id, type) => {
    try {
      const response = await fetch(`/api/admin/flag-inappropriate/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        if (type === 'activity') {
          setActivities((prevActivities) =>
            prevActivities && prevActivities.map((activity) =>
              activity._id === id ? { ...activity, isAppropriate: false } : activity
            )
          );
        } else if (type === 'itinerary') {
          setItineraries((prevItineraries) =>
            prevItineraries && prevItineraries.map((itinerary) =>
              itinerary._id === id ? { ...itinerary, isAppropriate: false } : itinerary
            )
          );
        }
      } else {
        console.error('Failed to flag as inappropriate');
      }
    } catch (error) {
      console.error('Error flagging as inappropriate:', error);
    }
  };

  return (
    <div>
      <h2>Activities</h2>
      {activities && activities.map((activity) => (
        <div key={activity._id}>
          <p><strong>Activity:</strong> {activity.name}</p>
          <button
            onClick={() => handleFlagAsInappropriate(activity._id, 'activity')}
            disabled={!activity.isAppropriate}
          >
            {activity.isAppropriate ? 'Flag as Inappropriate' : 'Inappropriate'}
          </button>
        </div>
      ))}

      <h2>Itineraries</h2>
      {itineraries && itineraries.map((itinerary) => (
        <div key={itinerary._id}>
          <p><strong>List of Activities:</strong> {itinerary.activities.join(', ')}</p>
          <p><strong>Timeline:</strong> {itinerary.timeline}</p>
          <button
            onClick={() => handleFlagAsInappropriate(itinerary._id, 'itinerary')}
            disabled={!itinerary.isAppropriate}
          >
            {itinerary.isAppropriate ? 'Flag as Inappropriate' : 'Inappropriate'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Events;
