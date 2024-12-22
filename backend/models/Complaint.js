const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['resolved', 'pending'], // Allowed values
    default: 'pending',           // Default status
  },
  reply: {
    type: String,
    trim: true,
    default: "No reply yet"
  },
  tourist: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tourist'
      },
  timestamp: {
    type: Date,
    default: Date.now,            // Automatically sets the current date and time
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
