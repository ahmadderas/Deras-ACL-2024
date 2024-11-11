// models/Worker.js
const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  role: { type: String, enum: ['Tour Guide', 'Advertiser', 'Seller'], required: true },
  documents: [{ type: String }], // URLs or file paths for uploaded documents
  accepted: { type: Boolean, default: false }, // Indicates if the worker is approved
  rejected: {type: Boolean, default: false},
  termsAccepted: {type: Boolean, default: false},
  username: { type: String , required: true , unique: true},
  tourGuideProfile: {
    mobileNumber: { type: String },
    previousWork: { type: String },
    yearsOfExperience: { type: Number },
    },
    advertiserProfile: {
      companyName: { type: String },
      website: { type: String },
      hotline: { type: String },
      companyProfile: { type: String }
    },
    sellerProfile: {
      name: { type: String },
      description: { type: String }
    },

});

module.exports = mongoose.model('Worker', workerSchema);
