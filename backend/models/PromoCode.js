const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,  // Ensures each promo code is unique
  },
  usageLimit: {
    type: Number,
    required: true,
    min: [1, 'Usage limit must be at least 1'],  // Minimum value of usage limit
  },
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
