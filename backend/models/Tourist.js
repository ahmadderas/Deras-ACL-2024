const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  email: { type: String, required: true, unique: true },
  DOB: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  occupation: { type: String, required: true },
  nationality: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  wallet: { type: Number, default: 0 },
  isNotifyRequested: { type: Boolean, default: false}
});

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
