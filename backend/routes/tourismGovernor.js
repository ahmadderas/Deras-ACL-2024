const express = require('express');
const { getMuseumsHistoricalPlaces, updateMuseumHistoricalPlace, createMuseumHistoricalPlace, deleteMuseumHistoricalPlace, getHistoricalTags, createHistoricalTag, updateHistoricalTag, deleteHistoricalTag } = require('../controllers/tourismGovernorController');
const router = express.Router();

// Get all museums/historical places
router.get('/museum-historical', getMuseumsHistoricalPlaces);

// Update a museum/historical place
router.patch('/museum-historical/:id', updateMuseumHistoricalPlace);

// Create a museum/historical place
router.post('/museum-historical', createMuseumHistoricalPlace);

// Delete a museum/historical place
router.delete('/museum-historical/:id', deleteMuseumHistoricalPlace);

// Get all tags
router.get('/historical-tags', getHistoricalTags);

// Create a new tag
router.post('/historical-tags', createHistoricalTag);

// Update a tag by ID
router.patch('/historical-tags/:id', updateHistoricalTag);

// Delete a tag by ID
router.delete('/historical-tags/:id', deleteHistoricalTag);
module.exports = router;
