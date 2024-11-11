const express = require('express');
const { addAdmin, addGovernor, viewSignupRequests, acceptWorker, rejectWorker, viewUsers, deleteUser, getCategories, updateCategory, createCategory, deleteCategory, getTags, createTag, updateTag, deleteTag, getUserStats, getActivitiesItineraries, flagInappropriate } = require('../controllers/adminController');

const router = express.Router();

// Route to add an admin
router.post('/add-admin', addAdmin);

// Route to add a tourism governor
router.post('/add-governor', addGovernor)

//Route to view signup requests
router.get('/view-signup-requests', viewSignupRequests )

//Route to accept a worker signup
router.patch('/view-signup-requests/accept/:id', acceptWorker);

//Route to reject a worker signup
router.patch('/view-signup-requests/reject/:id', rejectWorker);

//Route to view users to be deleted
router.get('/view-users' , viewUsers)

//Route to delete a user
router.delete('/delete-user/:type/:id', deleteUser);

// Get all categories
router.get('/activity-categories', getCategories);

// Create a new category
router.post('/activity-categories', createCategory);

 // Update a category by ID
router.patch('/activity-categories/:id', updateCategory);

// Delete a category by ID
router.delete('/activity-categories/:id', deleteCategory);

//Get all tags
router.get('/tags', getTags);

//Create a new tag
router.post('/tags', createTag);

//Update a tag by ID
router.patch('/tags/:id', updateTag);

//Delete a tag by ID
router.delete('/tags/:id', deleteTag);

//View user stats
router.get('/user-stats', getUserStats);

//View activities and itineraries
router.get('/activitiesItineraries', getActivitiesItineraries);

//Flag an event as inappropriate
router.put('/flag-inappropriate/:type/:id', flagInappropriate);

module.exports = router;
