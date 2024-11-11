const mongoose = require('mongoose');

const TouristBookingSchema = new mongoose.Schema({
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist'
    },
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    itineraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary'
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    isPaid: {
        type: Boolean,
        default: false
    }

  });
  
  const TouristBooking = mongoose.model('TouristBooking', TouristBookingSchema);
  
  module.exports = TouristBooking;
  
