const Notification = require('../models/Notification');
const Worker = require('../models/Worker');
const Activity = require('../models/activity/Activity');
const Category = require('../models/activity/Category');

// Fetch Advertiser Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from route params
    const worker = await Worker.findOne({ userId });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({
      profile: {
        companyName: worker.advertiserProfile.companyName,
        companyHotline: worker.advertiserProfile.companyHotline,
        companyWebsite: worker.advertiserProfile.companyWebsite,
        companyDescription: worker.advertiserProfile.companyDescription
      },
      userId: worker.userId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Advertiser Profile
const updateProfile = async (req, res) => {
  const { companyName, companyHotline, companyWebsite, companyDescription } = req.body;

  try {
    const worker = await Worker.findOneAndUpdate(
      { userId: req.params.id }, // Use req.params.id to get the userId
      { $set: { 
          'advertiserProfile.companyName': companyName, 
          'advertiserProfile.companyHotline': companyHotline, 
          'advertiserProfile.companyWebsite': companyWebsite,
          'advertiserProfile.companyDescription': companyDescription 
        } 
      },
      { new: true }
    );

    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    res.json({ message: 'Profile updated successfully', profile: worker.advertiserProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotifications = async (req,res) => {
  try {
    const  userId  = req.params.id;
    const notifications = await Notification.find( {userId} );
    res.json(notifications);
    console.log(userId);
    console.log(notifications);
  } catch(err) {
    res.status(500).json({ message: 'Error fetching notifications' });
    console.log(err);
  }
}

// Fetch all activities
const getActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await Activity.find( {userId} )
      .populate('category') // Populate the category reference
      .populate('tags'); // Populate the tags reference
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

// Create a new activity
const createActivity = async (req, res) => {
  const { userId } = req.params;
  const { name, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;

  try {
    const activityDate = new Date(`${date}T${time}:00`); // Ensure correct format for date and time

    const newActivity = new Activity({
      name,
      date: activityDate,
      location,
      price,
      category,
      tags,
      specialDiscounts,
      isBookingOpen,
      userId
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    console.error("Error creating activity:", err); // Log the full error
    res.status(500).json({ message: 'Error creating activity', error: err.message });
  }
};


// Update an activity
const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;

  try {
    const activityDate = new Date(`${date} ${time}`); // Combine date and time into one Date object

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      {
        name,
        date: activityDate, // Store the combined date and time
        location,
        price,
        category,
        tags,
        specialDiscounts,
        isBookingOpen,
      },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(updatedActivity);
  } catch (err) {
    res.status(500).json({ message: 'Error updating activity' });
  }
};

// Delete an activity
const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting activity' });
  }
};





module.exports = {
  getProfile,
  updateProfile,
  getActivities,
  createActivity,
  deleteActivity,
  updateActivity,
  getNotifications
};
