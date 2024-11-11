import React, { useState, useEffect } from 'react';

const MuseumHistoricalPlaceComponent = () => {
  const [places, setPlaces] = useState([]);
  const [formData, setFormData] = useState({
    type: 'museum',
    name: '',
    description: '',
    location: '',
    openingTime: '',
    closingTime: '',
    ticketPrices: {
      foreigner: '',
      native: '',
      student: ''
    },
    historicalTag: '', // New field for historical tag
  });
  const [editMode, setEditMode] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [historicalTags, setHistoricalTags] = useState([]); // State to store historical tags

  // Fetch all museums and historical places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/tourismGovernor/museum-historical');
        if (!response.ok) throw new Error('Error fetching places');
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlaces();
  }, []);

  // Fetch historical tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tourismGovernor/historical-tags');
        if (!response.ok) throw new Error('Error fetching tags');
        const data = await response.json();
        setHistoricalTags(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle ticket prices changes
  const handleTicketPriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      ticketPrices: { ...prevData.ticketPrices, [name]: value }
    }));
  };

  // Submit form to create or update a place
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? 'PATCH' : 'POST';
    const url = editMode
      ? `/api/tourismGovernor/museum-historical/${editingPlaceId}`
      : '/api/tourismGovernor/museum-historical';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error submitting place data');
      const updatedPlace = await response.json();

      if (editMode) {
        setPlaces(places.map((place) => (place._id === editingPlaceId ? updatedPlace : place)));
      } else {
        setPlaces([...places, updatedPlace]);
      }

      setFormData({
        type: 'museum',
        name: '',
        description: '',
        location: '',
        openingTime: '',
        closingTime: '',
        ticketPrices: {
          foreigner: '',
          native: '',
          student: ''
        },
        historicalTag: '', // Reset historicalTag
      });
      setEditMode(false);
      setEditingPlaceId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Edit a place
  const handleEdit = (place) => {
    setFormData({
      type: place.type,
      name: place.name,
      description: place.description,
      location: place.location,
      openingTime: place.openingTime,
      closingTime: place.closingTime,
      ticketPrices: place.ticketPrices,
      historicalTag: place.historicalTag ? place.historicalTag._id : '', // Set historical tag
    });
    setEditMode(true);
    setEditingPlaceId(place._id);
  };

  // Delete a place
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tourismGovernor/museum-historical/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting place');
      setPlaces(places.filter((place) => place._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Museums & Historical Places Manager</h1>
      <form onSubmit={handleSubmit}>
        <select name="type" value={formData.type} onChange={handleInputChange}>
          <option value="museum">Museum</option>
          <option value="historical place">Historical Place</option>
        </select>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required></textarea>
        <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" required />
        <input type="text" name="openingTime" value={formData.openingTime} onChange={handleInputChange} placeholder="Opening Time (HH:mm)" required />
        <input type="text" name="closingTime" value={formData.closingTime} onChange={handleInputChange} placeholder="Closing Time (HH:mm)" required />
        <div>
          <label>Ticket Prices</label>
          <input type="number" name="foreigner" value={formData.ticketPrices.foreigner} onChange={handleTicketPriceChange} placeholder="Foreigner Price" required />
          <input type="number" name="native" value={formData.ticketPrices.native} onChange={handleTicketPriceChange} placeholder="Native Price" required />
          <input type="number" name="student" value={formData.ticketPrices.student} onChange={handleTicketPriceChange} placeholder="Student Price" required />
        </div>
        <select name="historicalTag" value={formData.historicalTag} onChange={handleInputChange}>
          <option value="">Select Historical Tag</option>
          {historicalTags.map(tag => (
            <option key={tag._id} value={tag._id}>{tag.name}</option>
          ))}
        </select>
        <button type="submit">{editMode ? 'Update Place' : 'Create Place'}</button>
      </form>

      <ul>
        {places.map(place => (
          <li key={place._id}>
            <h3>{place.name}</h3>
            <p>{place.description}</p>
            <button onClick={() => handleEdit(place)}>Edit</button>
            <button onClick={() => handleDelete(place._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MuseumHistoricalPlaceComponent;
