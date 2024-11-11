const express = require('express');
const { getProfile, updateProfile, getActivities, createActivity, updateActivity, deleteActivity, getNotifications } = require('../controllers/advertiserController');

const router = express.Router();

//Get notifications
router.get('/notifications/:id', getNotifications);

// Get Advertiser Profile
router.get('/profile/:id', getProfile);

// Update Advertiser Profile
router.patch('/update-profile/:id', updateProfile);

// Route to fetch all activities
router.get('/activities/:userId', getActivities);

// Route to create a new activity
router.post('/activities/:userId', createActivity);

// Route to update an activity
router.patch('/activities/:id', updateActivity);

// Route to delete an activity
router.delete('/activities/:id', deleteActivity);



module.exports = router;
