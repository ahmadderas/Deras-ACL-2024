// controllers/authController.js
const User = require('../models/User');
const Worker = require('../models/Worker');
const Tourist = require('../models/Tourist'); // Import Tourist model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

dotenv.config();

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    let additionalData = {};
    if (['Advertiser', 'Tour Guide', 'Seller'].includes(user.role)) {
      const worker = await Worker.findOne({ userId: user._id });
      if (worker) {
        additionalData = {
          accepted: worker.accepted,
          termsAccepted: worker.termsAccepted,
        };
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, userId: user._id, ...additionalData });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept Terms
const acceptTerms = async (req, res) => {
  const { userId } = req.body;
  try {
    const worker = await Worker.findOneAndUpdate(
      { userId },
      { $set: { termsAccepted: true } },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Terms accepted successfully', user: worker });
  } catch (error) {
    console.error('Error during updating terms acceptance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || !username) {
    return res.status(400).json({ message: 'Current password, new password, and username are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ message: 'Error changing password', error: err.message });
  }
};

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpMap = new Map();

const sendOTP = async (req, res) => {
  const { email, role } = req.body;
  console.log('Received email:', email, 'Role:', role); // Log input values

  try {
    let user;
    if (role === 'Tourist') {
      user = await Tourist.findOne({ email });
    } else if (['Advertiser', 'Seller', 'Tour Guide'].includes(role)) {
      user = await Worker.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otpMap.set(email, otp);
    setTimeout(() => otpMap.delete(email), 10 * 60 * 1000);

    // Log the OTP generation to verify it's correct
    console.log('Generated OTP:', otp);

    // Send OTP via email using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP code is ${otp}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response); // Log email send status

      res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
      console.error('Error sending OTP email:', error); // Log the error from sending email
      return res.status(500).json({ message: 'Error sending OTP email', error: error.message });
    }
  } catch (error) {
    console.error('Error in sendOTP function:', error); // Log any errors
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP
const verifyOTP = (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const storedOtp = otpMap.get(email);

  if (storedOtp && storedOtp === otp) {
    otpMap.delete(email);
    return res.status(200).json({ message: 'OTP verified' });
  }
  res.status(400).json({ message: 'Invalid or expired OTP' });
};

// Reset Password
const resetPassword = async (req, res) => {
  const email = req.body.email;
  const role = req.body.role;
  const newPassword = req.body.newPassword;
  try {
    let user;
    if (role === 'Tourist') {
      user = await Tourist.findOne({ email });
    } else if (['Advertiser', 'Seller', 'Tour Guide'].includes(role)) {
      user = await Worker.findOne({ email });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(newPassword);
    const id = user.userId;
    const user1 = await User.findOne(id);
    user1.password = newPassword;
    await user1.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

module.exports = { loginUser, acceptTerms, changePassword, sendOTP, verifyOTP, resetPassword };
