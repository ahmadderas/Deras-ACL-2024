const mongoose = require('mongoose');

const historicalTagSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true, 
      unique: true 
    }
  });
  
  const HistoricalTag = mongoose.model('HistoricalTag', historicalTagSchema);
  
  module.exports = HistoricalTag;
  
