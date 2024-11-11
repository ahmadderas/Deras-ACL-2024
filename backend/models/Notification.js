const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    description: { 
      type: String, 
      required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' },
    },{
        timestamps: {createdAt: true, updatedAt: false}
  });
  
  const Notification = mongoose.model('Notification', NotificationSchema);
  
  module.exports = Notification;
  
