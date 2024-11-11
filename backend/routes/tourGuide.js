// routes/tourGuideRoute.js
const express = require('express');
const { getProfile, updateProfile, createItinerary, getItineraries, updateItinerary, deleteItinerary, getNotifications } = require('../controllers/tourGuideController');


const router = express.Router();

// Get notifications
router.get('/notifications/:id', getNotifications);

// Get Tour Guide Profile
router.get('/profile/:id', getProfile);

// Update Tour Guide Profile
router.patch('/update-profile/:id', updateProfile);

// Route to create a new itinerary
router.post('/itineraries/:userId', createItinerary);

// Route to get all itineraries
router.get('/itineraries/:userId', getItineraries);

// Route to update an itinerary by ID
router.patch('/itineraries/:id', updateItinerary);

// Route to delete an itinerary by ID
router.delete('/itineraries/:id', deleteItinerary);

module.exports = router;
