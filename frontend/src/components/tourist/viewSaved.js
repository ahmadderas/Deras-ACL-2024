import React, { useState, useEffect } from 'react';

const ViewSaved = () => {
  const [savedActivities, setSavedActivities] = useState([]);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [isNotifyRequested, setIsNotifyRequested] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const response = await fetch('/api/tourist/view-saved');
        if (!response.ok) throw new Error('Failed to fetch saved data');
        const data = await response.json();

        setSavedActivities(data.activities || []);
        setSavedItineraries(data.itineraries || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedData();
  }, []);

  const handleReceiveNotifications = async (userId) => {
    try {
      
      const response = await fetch(`/api/tourist/receive-notifications/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to enable notifications');
      }

      const data = await response.json();
      alert(data.message);  // Show success message
      setIsNotifyRequested(true); // Mark that the user has requested notifications
    } catch (error) {
      console.error(error);
      alert('Error enabling notifications');
    }
  };

  return (
    <div>
      <h1>Saved Activities and Itineraries</h1>

      <section>
        <h2>Saved Activities</h2>
        {savedActivities.length === 0 ? (
          <p>No saved activities.</p>
        ) : (
          savedActivities.map(activity => (
            <div key={activity._id}>
              <h3>{activity.name}</h3>
              {/* Activity details */}
            </div>
          ))
        )}
      </section>

      <section>
        <h2>Saved Itineraries</h2>
        {savedItineraries.length === 0 ? (
          <p>No saved itineraries.</p>
        ) : (
          savedItineraries.map(itinerary => (
            <div key={itinerary._id}>
              <h3>{itinerary.timeline}</h3>
              {/* Itinerary details */}
            </div>
          ))
        )}
      </section>

      {!isNotifyRequested && (
        <button onClick={handleReceiveNotifications}>
          Receive notifications when saved events are open for booking
        </button>
      )}
    </div>
  );
};

export default ViewSaved;
