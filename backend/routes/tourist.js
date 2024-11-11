const express = require('express');
const { getTouristProfile, updateTouristProfile, getAll, bookActivity, bookItinerary, getCompleteEvents, addCommentAndRating, saveActivity, saveItinerary, viewSaved, receiveNotifications } = require('../controllers/touristController');
const { getNotifications } = require('../controllers/tourGuideController');
const router = express.Router();

//Get user profile
router.get('/update-profile/:id', getTouristProfile);

//Get notifications
router.get('/notifications/:id', getNotifications);

//Update user profile
router.patch('/update-profile/:id', updateTouristProfile);

//View events and historical places
router.get('/view-all', getAll);

//Book activity
router.post('/book-activity/:id', bookActivity);

//Book itinerary
router.post('/book-itinerary/:id', bookItinerary);

//Get complete events
router.get('/comments/:id', getCompleteEvents);

//Add comments
router.post('/comments/add', addCommentAndRating);

//Save activity
router.post('/save-activity/:id', saveActivity);

//Save Itinerary
router.post('/save-itinerary/:id', saveItinerary);

//Get saved events
router.get('/view-saved', viewSaved);

//Request to receive notifications
router.put('/receive-notifications/:id', receiveNotifications );


module.exports = router;
