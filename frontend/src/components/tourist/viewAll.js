import React, { useState, useEffect } from 'react';

const ViewAll = () => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [historicalTags, setHistoricalTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActivityTag, setSelectedActivityTag] = useState('');
  const [sortCriteria, setSortCriteria] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState({}); // Track booking status
  const [bookedItems, setBookedItems] = useState({});
  const [savedItems, setSavedItems] = useState({});


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tourist/view-all');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        setActivities(data.activities || []);
        setItineraries(data.itineraries || []);
        setHistoricalPlaces(data.historicalPlaces || []);
        setHistoricalTags(data.historicalTags || []);
        setCategories(data.categories || []);
        setTags(data.tags || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSave = async (id, type) => {
    try {
      const response = await fetch(`/api/tourist/save-${type}/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to save item');
      
      setSavedItems(prev => ({ ...prev, [id]: true })); // Mark item as saved locally
      alert('Item saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const convertPrice = (price) => {
    return currency === 'LE' ? price * 50 : price;
  };

  const formatPrice = (price) => {
    return currency === 'LE' ? `LE ${convertPrice(price)}` : `$${convertPrice(price)}`;
  };

  const handleUpcomingChange = (e) => {
    setIsUpcoming(e.target.checked);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleActivityTagChange = (e) => {
    setSelectedActivityTag(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBooking = async (id, type) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No user ID found in local storage');
      return;
    }
  
    if (bookedItems[id]) {
      alert('You have already booked this event.');
      return;
    }
  
    try {
      setBookingInProgress(prev => ({ ...prev, [id]: true }));
  
      const response = await fetch(`/api/tourist/book-${type}/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
      if (!response.ok) {
        alert('You already booked this event');
        const errorData = await response.json();
        console.error('Booking error:', errorData);
        throw new Error('Failed to book');
        
      }
  
      const result = await response.json();
      console.log('Booked successfully:', result);
      setBookedItems(prev => ({ ...prev, [id]: true }));

  
      // Show success alert
      alert('Booking successful!');
  
    } catch (error) {
      console.error(error);
    } finally {
      setBookingInProgress(prev => ({ ...prev, [id]: false }));
    }
  };
  
  

  const isUpcomingEvent = (eventDate) => {
    const currentDate = new Date();
    return new Date(eventDate) > currentDate;
  };

  const filteredActivities = isUpcoming
    ? activities.filter(activity => isUpcomingEvent(activity.date))
    : activities;

  const filteredItineraries = isUpcoming
    ? itineraries.filter(itinerary => itinerary.availableDates.some(date => isUpcomingEvent(date.date)))
    : itineraries;

  const filteredActivitiesByCategory = selectedCategory
    ? filteredActivities.filter(activity => activity.category && activity.category._id === selectedCategory)
    : filteredActivities;

  const filteredActivitiesByTag = selectedActivityTag
    ? filteredActivitiesByCategory.filter(activity => activity.tags && activity.tags.some(tag => tag._id === selectedActivityTag))
    : filteredActivitiesByCategory;

  const filteredHistoricalPlaces = selectedTag
    ? historicalPlaces.filter(place => place.historicalTag && place.historicalTag._id === selectedTag)
    : historicalPlaces;

  const filteredActivitiesBySearch = searchQuery
    ? filteredActivitiesByTag.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredActivitiesByTag;

  const sortItems = (items) => {
    return items.sort((a, b) => {
      if (sortCriteria === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortCriteria === 'price') {
        return a.price - b.price;
      }
      if (sortCriteria === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
  };

  const sortedActivities = sortItems(filteredActivitiesBySearch);
  const sortedItineraries = sortItems(filteredItineraries);
  const sortedHistoricalPlaces = sortItems(filteredHistoricalPlaces);

  return (
    <div>
      <h1>All Data Overview</h1>

      {/* Currency Selection Dropdown */}
      <div>
        <label>Select Currency: </label>
        <select onChange={handleCurrencyChange} value={currency}>
          <option value="USD">USD</option>
          <option value="LE">LE</option>
        </select>
      </div>

      {/* Upcoming Checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={isUpcoming}
            onChange={handleUpcomingChange}
          />
          Show Upcoming Events Only
        </label>
      </div>

      {/* Search Bar for Activity Name */}
      <div>
        <label>Search Activities by Name: </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
        />
      </div>

      {/* Sort by Dropdown */}
      <div>
        <label>Sort By: </label>
        <select onChange={handleSortChange} value={sortCriteria}>
          <option value="date">Date</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Category Filter Dropdown */}
      <div>
        <label>Filter Activities by Category: </label>
        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Tag Filter Dropdown */}
      <div>
        <label>Filter Activities by Tag: </label>
        <select onChange={handleActivityTagChange} value={selectedActivityTag}>
          <option value="">All Tags</option>
          {tags.map(tag => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Historical Tag Filter Dropdown */}
      <div>
        <label>Filter Historical Places by Tag: </label>
        <select onChange={handleTagChange} value={selectedTag}>
          <option value="">All Tags</option>
          {historicalTags.map(tag => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activities Section */}
      <section>
        <h2>Activities</h2>
        {sortedActivities.length === 0 ? (
          <p>No activities available.</p>
        ) : (
          sortedActivities.map(activity => (
            <div key={activity._id} className="item">
              <h3>{activity.name}</h3>
              <p><strong>Category:</strong> {activity.category.name}</p>
              <p><strong>Date:</strong> {activity.date}</p>
              <p><strong>Location:</strong> {activity.location}</p>
              <p><strong>Price:</strong> {formatPrice(activity.price)}</p>
              <p><strong>Tags:</strong> {activity.tags && activity.tags.map(tag => tag.name).join(', ')}</p>
              <p><strong>Special Discounts:</strong> {activity.specialDiscounts ? 'Yes' : 'No'}</p>
              <p><strong>Booking Open:</strong> {activity.isBookingOpen ? 'Yes' : 'No'}</p>
              <p><strong>Rating:</strong> {activity.rating}</p>
              <button 
                onClick={() => handleBooking(activity._id, 'activity')} 
                disabled={bookingInProgress[activity._id]}
                style={{ backgroundColor: bookingInProgress[activity._id] ? 'grey' : 'blue' }}
              >
                {bookingInProgress[activity._id] ? 'Booked' : 'Book Now'}
              </button>
              <button
  onClick={() => handleSave(activity._id, 'activity')}
  disabled={savedItems[activity._id]}
  style={{ backgroundColor: savedItems[activity._id] ? 'grey' : 'green' }}
>
  {savedItems[activity._id] ? 'Saved' : 'Save'}
</button>
            </div>
          ))
        )}
      </section>

            {/* Itineraries Section */}
            <section>
        <h2>Itineraries</h2>
        {sortedItineraries.length === 0 ? (
          <p>No itineraries available.</p>
        ) : (
          sortedItineraries.map(itinerary => (
            <div key={itinerary._id} className="item">
              <h3>{itinerary.name}</h3>
              <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
              <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
              <p><strong>Duration:</strong> {itinerary.durations.join(', ')}</p>
              <p><strong>Language:</strong> {itinerary.language}</p>
              <p><strong>Locations:</strong> {itinerary.locations.join(', ')}</p>
              <p><strong>Price:</strong> {formatPrice(itinerary.price)}</p>
              <p><strong>Rating:</strong> {itinerary.rating}</p>
              <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date.date).toLocaleString()).join(', ')}</p>
              <button 
                onClick={() => handleBooking(itinerary._id, 'itinerary')} 
                disabled={bookingInProgress[itinerary._id]}
                style={{ backgroundColor: bookingInProgress[itinerary._id] ? 'grey' : 'blue' }}
              >
                {bookingInProgress[itinerary._id] ? 'Booked' : 'Book Now'}
              </button>
              <button
               onClick={() => handleSave(itinerary._id, 'itinerary')}
               disabled={savedItems[itinerary._id]}
               style={{ backgroundColor: savedItems[itinerary._id] ? 'grey' : 'green' }}
>
  {savedItems[itinerary._id] ? 'Saved' : 'Save'}
</button>
            </div>
          ))
        )}
      </section>

      {/* Historical Places Section */}
      <section>
        <h2>Historical Places</h2>
        {sortedHistoricalPlaces.length === 0 ? (
          <p>No historical places available.</p>
        ) : (
          sortedHistoricalPlaces.map(place => (
            <div key={place._id} className="item">
              <h3>{place.name}</h3>
              <p><strong>Type:</strong> {place.type}</p>
              <p><strong>Description:</strong> {place.description}</p>
              <p><strong>Location:</strong> {place.location}</p>
              <p><strong>Opening Time:</strong> {place.openingTime}</p>
              <p><strong>Closing Time:</strong> {place.closingTime}</p>
              <p><strong>Ticket Prices:</strong></p>
                <li>Foreigner: {formatPrice(place.ticketPrices.foreigner)}</li>
                <li>Native: {formatPrice(place.ticketPrices.native)}</li>
                <li>Student: {formatPrice(place.ticketPrices.student)}</li>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ViewAll;
