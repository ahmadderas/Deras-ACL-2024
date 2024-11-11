const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Worker'},
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  tourists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],
  comments: [{ type: String}],
  advertiserComments: [{ type: String}],
  counter: { type: Number, default: 0},
  specialDiscounts: { type: String },
  isBookingOpen: { type: Boolean, default: true },
  isAppropriate: { type: Boolean, default: true},
  isComplete: {type: Boolean, default: false},
  isSaved: {type: Boolean, default: false},
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
  advertiserRating: {
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


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
