const mongoose = require('mongoose');
const Itinerary = require('./models/Itinerary');  // Adjust the path to your Itinerary model
const Activity = require('./models/activity/Activity');    // Adjust the path to your Activity model
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Clear the tourists array in all Itinerary documents
    Itinerary.updateMany({}, { $set: { tourists: [] } })
      .then(() => {
        console.log('Cleared tourists array in Itineraries');

        // Clear the tourists array in all Activity documents
        return Activity.updateMany({}, { $set: { tourists: [] } });
      })
      .then(() => {
        console.log('Cleared tourists array in Activities');
        mongoose.disconnect();
      })
      .catch(err => {
        console.error('Error clearing tourists array:', err);
        mongoose.disconnect();
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
