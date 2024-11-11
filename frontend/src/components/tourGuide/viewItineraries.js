import React, { useState, useEffect } from 'react';

const ItineraryComponent = () => {
  const [itineraries, setItineraries] = useState([]);
  const [formData, setFormData] = useState({
    activities: [],
    durations: [],
    timeline: '',
    language: '',
    price: '',
    availableDates: [],
    locations: [],
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editingItineraryId, setEditingItineraryId] = useState(null);
  const userId = localStorage.getItem('userId');

  // Add new activity & duration field
  const addActivityField = () => {
    setFormData((prevData) => ({
      ...prevData,
      activities: [...prevData.activities, ''],
      durations: [...prevData.durations, ''],
    }));
  };

  // Add new location field
  const addLocationField = () => {
    setFormData((prevData) => ({
      ...prevData,
      locations: [...prevData.locations, ''],
    }));
  };

  // Add new available date field
  const addAvailableDateField = () => {
    setFormData((prevData) => ({
      ...prevData,
      availableDates: [...prevData.availableDates, { date: '', time: '' }],
    }));
  };

  // Handle form data changes
  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedData = { ...formData };

    if (type === 'activity') {
      updatedData.activities[index] = value;
    } else if (type === 'duration') {
      updatedData.durations[index] = value;
    } else if (type === 'location') {
      updatedData.locations[index] = value;
    } else if (type === 'availableDate') {
      updatedData.availableDates[index] = { ...updatedData.availableDates[index], [name]: value };
    } else {
      updatedData[name] = value;
    }

    setFormData(updatedData);
  };

  // Handle submitting the form to create or update an itinerary
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editMode ? 'PATCH' : 'POST';
      const url = editMode
        ? `/api/tourGuide/itineraries/${editingItineraryId}`
        : `/api/tourGuide/itineraries/${userId}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData, userId),
      });
      if (!response.ok) {
        throw new Error('Error submitting itinerary');
      }

      const updatedItinerary = await response.json();
      if (editMode) {
        setItineraries(itineraries.map((itinerary) => (itinerary._id === editingItineraryId ? updatedItinerary : itinerary)));
      } else {
        setItineraries([...itineraries, updatedItinerary]);
      }

      // Reset form and states after submission
      setFormData({
        activities: [],
        durations: [],
        timeline: '',
        language: '',
        price: '',
        availableDates: [],
        locations: [],
        accessibility: '',
        pickupLocation: '',
        dropoffLocation: '',
      });
      setEditMode(false);
      setEditingItineraryId(null);
    } catch (error) {
      console.error('Error submitting itinerary', error);
    }
  };

  // Handle deleting an itinerary
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tourGuide/itineraries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting itinerary');
      }
      setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
    } catch (error) {
      console.error('Error deleting itinerary', error);
    }
  };

  // Handle editing an itinerary
  const handleEdit = (itinerary) => {
    setFormData({
      activities: itinerary.activities || [],
      durations: itinerary.durations || [],
      timeline: itinerary.timeline || '',
      language: itinerary.language || '',
      price: itinerary.price || '',
      availableDates: itinerary.availableDates || [],
      locations: itinerary.locations || [],
      accessibility: itinerary.accessibility || '',
      pickupLocation: itinerary.pickupLocation || '',
      dropoffLocation: itinerary.dropoffLocation || '',
    });
    setEditMode(true);
    setEditingItineraryId(itinerary._id);
  };

  // Fetch all itineraries from the backend
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch(`/api/tourGuide/itineraries/${userId}`);
        if (!response.ok) {
          throw new Error('Error fetching itineraries');
        }
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error('Error fetching itineraries', error);
        console.log(userId);
      }
    };
    fetchItineraries();
  }, []);

  return (
    <div>
      <h1>Itinerary Manager</h1>

      {/* Form to create or update itinerary */}
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Activities and Durations</h3>
          {formData.activities.map((activity, index) => (
            <div key={index}>
              <input
                type="text"
                name="activity"
                value={activity}
                onChange={(e) => handleInputChange(e, index, 'activity')}
                placeholder="Activity"
              />
              <input
                type="number"
                name="duration"
                value={formData.durations[index] || ''}
                onChange={(e) => handleInputChange(e, index, 'duration')}
                placeholder="Duration (minutes)"
              />
            </div>
          ))}
          <button type="button" onClick={addActivityField}>
            Add Activity
          </button>
        </div>

        <div>
          <h3>Locations</h3>
          {formData.locations.map((location, index) => (
            <div key={index}>
              <input
                type="text"
                name="location"
                value={location}
                onChange={(e) => handleInputChange(e, index, 'location')}
                placeholder="Location"
              />
            </div>
          ))}
          <button type="button" onClick={addLocationField}>
            Add Location
          </button>
        </div>

        <div>
          <h3>Available Dates</h3>
          {formData.availableDates.map((availableDate, index) => (
            <div key={index}>
              <input
                type="date"
                name="date"
                value={availableDate.date}
                onChange={(e) => handleInputChange(e, index, 'availableDate')}
                placeholder="Date"
              />
              <input
                type="time"
                name="time"
                value={availableDate.time}
                onChange={(e) => handleInputChange(e, index, 'availableDate')}
                placeholder="Time"
              />
            </div>
          ))}
          <button type="button" onClick={addAvailableDateField}>
            Add Available Date
          </button>
        </div>

        <div>
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            placeholder="Timeline"
          />
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            placeholder="Language"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleInputChange}
            placeholder="Pickup Location"
          />
          <input
            type="text"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleInputChange}
            placeholder="Dropoff Location"
          />
          <input
            type="text"
            name="accessibility"
            value={formData.accessibility}
            onChange={handleInputChange}
            placeholder="Accessibility"
          />
        </div>

        <button type="submit">{editMode ? 'Update Itinerary' : 'Create Itinerary'}</button>
      </form>

      {/* List of itineraries */}
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <div><strong>Timeline:</strong> {itinerary.timeline}</div>
            <div><strong>Language:</strong> {itinerary.language}</div>
            <div><strong>Activities:</strong> {itinerary.activities && itinerary.activities.join(', ')}</div>
            <div><strong>Durations:</strong> {itinerary.durations && itinerary.durations.join(', ')} minutes</div>
            <div><strong>Price:</strong> ${itinerary.price}</div>
            <div><strong>Locations:</strong> {itinerary.locations && itinerary.locations.join(', ')}</div>
            <div><strong>Dates:</strong> {itinerary.availableDates && itinerary.availableDates.map(date => `${date.date} at ${date.time}`).join(', ')}</div>
            <div><strong>Pickup Location:</strong> {itinerary.pickupLocation}</div>
            <div><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</div>
            <div><strong>Accessibility:</strong> {itinerary.accessibility}</div>
            <button onClick={() => handleEdit(itinerary)}>Edit</button>
            <button onClick={() => handleDelete(itinerary._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryComponent;
