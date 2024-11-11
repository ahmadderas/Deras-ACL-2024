// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const tourGuideRoutes = require('./routes/tourGuide');
const SellerRoutes = require('./routes/seller');
const AdvertiserRoutes = require('./routes/advertiser');
const GovernorRoutes = require('./routes/tourismGovernor');
const TouristRoutes = require('./routes/tourist')

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/tourGuide', tourGuideRoutes);
app.use('/api/seller', SellerRoutes);
app.use('/api/advertiser', AdvertiserRoutes);
app.use('/api/tourismGovernor', GovernorRoutes);
app.use('/api/tourist', TouristRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
