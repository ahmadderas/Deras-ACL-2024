const mongoose = require('mongoose');

const MuseumHistoricalPlaceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['museum', 'historical place'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  openingTime: {
    type: String, // 'HH:mm' format (e.g., '09:00' for 9 AM)
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // regex to ensure 'HH:mm' format
  },
  historicalTag: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'HistoricalTag'},

  closingTime: {
    type: String, // 'HH:mm' format (e.g., '18:00' for 6 PM)
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/, // regex to ensure 'HH:mm' format
  },
  ticketPrices: {
    foreigner: {
      type: Number,
      required: true,
    },
    native: {
      type: Number,
      required: true,
    },
    student: {
      type: Number,
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('MuseumHistoricalPlace', MuseumHistoricalPlaceSchema);
