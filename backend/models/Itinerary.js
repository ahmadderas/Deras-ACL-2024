const mongoose = require('mongoose');

// Schema for itinerary
const itinerarySchema = new mongoose.Schema({
  activities: [{
    type: String,
    required: true
  }],
  timeline: { 
    type: String, // Describes what happens during the tour
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Worker'
  },
  durations: [{
    type: String,
    required: true
  }],
  language: { 
    type: String, 
    required: true // Language of the tour
  },
  locations: {
    type: [String], // Changed to an array of strings
    required: true
  },
  price: { 
    type: Number, 
    required: true // Price of the tour
  },
  availableDates: [{
    date: { 
      type: Date, 
      required: true // Date and time combined
    }
  }],
  accessibility: { 
    type: String 
  }, 
  pickupLocation: { 
    type: String, 
    required: true // Pickup location string
  }, 
  dropoffLocation: { 
    type: String, 
    required: true // Dropoff location string
  }, 
  isBooked: { 
    type: Boolean, 
    default: false // To check if the itinerary is booked
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  isAppropriate: {
    type: Boolean,
    default: true
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  tourists: [{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Tourist' }],
  comments: [{
     type: String}],
  tourGuideComments: [{
     type: String}],
  counter: {
    type:Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0, // Minimum rating value
    max: 5, // Maximum rating value
    validate: {
      validator: Number.isFinite,
      message: '{VALUE} is not a valid rating',
    },
    required: true,
    default: 0,
  },
  tourGuideRating: {
    type: Number,
    min: 0, // Minimum rating value
    max: 5, // Maximum rating value
    validate: {
      validator: Number.isFinite,
      message: '{VALUE} is not a valid rating',
    },
    required: true,
    default: 0,
  }
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
