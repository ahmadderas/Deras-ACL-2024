const mongoose = require('mongoose');

const HistoricalTagSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true, 
      unique: true 
    }
  });
  
  const HistoricalTag = mongoose.model('HistoricalTag', HistoricalTagSchema);
  
  module.exports = HistoricalTag;
  
