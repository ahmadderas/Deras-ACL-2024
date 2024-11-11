// routes/auth.js
const express = require('express');
const { loginUser, acceptTerms, changePassword, sendOTP, verifyOTP, resetPassword } = require('../controllers/authController');
const { signup } = require('../controllers/signupController');

const router = express.Router();

router.post('/login', loginUser);

router.patch('/accept-terms', acceptTerms);

router.post('/signup', signup);

router.patch('/change-password', changePassword);
    
// Send OTP to user's email
router.post('/forgot-password', sendOTP); 

// Verify OTP
router.post('/verify-otp', verifyOTP);      

// Reset password if OTP is valid
router.post('/reset-password', resetPassword);  

module.exports = router;
