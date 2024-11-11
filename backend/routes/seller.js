const express = require('express');
const { getProfile, updateProfile } = require('../controllers/sellerController');

const router = express.Router();

// Get Seller Profile
router.get('/profile/:id', getProfile);

// Update Seller Profile
router.patch('/update-profile/:id', updateProfile);

module.exports = router;
