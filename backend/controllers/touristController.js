const Tourist = require('../models/Tourist');  
const Activity = require('../models/activity/Activity');
const Itinerary = require('../models/Itinerary');
const HistoricalPlace = require('../models/museumHistorical/MuseumHistoricalPlace');
const HistoricalTag = require('../models/museumHistorical/HistoricalTag');
const Category = require('../models/activity/Category');
const Tag = require('../models/Tag');
const Worker = require('../models/Worker');
// Fetch tourist profile data
const getTouristProfile = async (req, res) => {
  const  userId  = req.params.id;  

  try {
    const tourist = await Tourist.findOne({ userId });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' + userId});
    }

    res.status(200).json(tourist);  // Send the profile data back
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
};

// Update tourist profile data (excluding username and wallet)
const updateTouristProfile = async (req, res) => {
    const userId = req.params.id;  // Get userId from the request parameters
    const { email, mobileNumber, nationality, jobOrStudent, jobTitle } = req.body;  // Expect the fields from the frontend
  
    try {
      // Find the tourist document by userId
      const tourist = await Tourist.findOne({ userId });
  
      // If the tourist does not exist, return a 404 error
      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }
  
      // Handle occupation based on the selected job or student option
      let occupation = 'Student'; // Default value if no job is selected
      if (jobOrStudent === 'Job') {
        occupation = jobTitle || tourist.occupation; // Set job title if available, else keep previous occupation
      }
  
      // Only update the fields that were provided in the request body
      tourist.email = email || tourist.email;  // Update email if provided
      tourist.mobileNumber = mobileNumber || tourist.mobileNumber;  // Update mobileNumber if provided
      tourist.nationality = nationality || tourist.nationality;  // Update nationality if provided
      tourist.occupation = occupation;  // Update occupation based on the job/student choice
  
      // Save the updated tourist data to the database
      await tourist.save();
  
      // Return the updated tourist data in the response
      res.status(200).json(tourist);  
    } catch (error) {
      // Handle any errors that occur
      console.error(error);
      res.status(500).json({ message: 'Error updating profile data' });
    }
  };

  // Controller to fetch all activities, itineraries, and historical places
const getAll = async (req, res) => {
  try {
    // Fetch all activities from the database
    const activities = await Activity.find().populate('category').populate('tags');
    
    // Fetch all itineraries from the database
    const itineraries = await Itinerary.find()
    
    // Fetch all historical places from the database
    const historicalPlaces = await HistoricalPlace.find().populate('historicalTag');

    const historicalTags = await HistoricalTag.find();
    console.log(historicalTags);

    const categories = await Category.find();

    const tags = await Tag.find();
    
    // Return all data as a JSON response
    res.status(200).json({
      activities,
      itineraries,
      historicalPlaces,
      historicalTags,
      categories,
      tags
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
};

const bookActivity = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    console.log('Received booking request for activity:', { userId, id });

    const activity = await Activity.findById(id);
    if (!activity) {
      console.error('Activity not found:', id);
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Ensure tourists is an array
    if (!Array.isArray(activity.tourists)) {
      activity.tourists = [];
    }

    if (activity.tourists.includes(userId)) {
      console.error('User already booked this activity:', userId);
      return res.status(400).json({ message: 'User already booked this activity' });
    }

    activity.tourists.push(userId);
    await activity.save();

    res.status(200).json({ message: 'Activity booked successfully', activity });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const bookItinerary = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    console.log('Received booking request for itinerary:', { userId, id });

    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      console.error('Itinerary not found:', id);
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Ensure tourists is an array
    if (!Array.isArray(itinerary.tourists)) {
      itinerary.tourists = [];
    }

    if (itinerary.tourists.includes(userId)) {
      console.error('User already booked this itinerary:', userId);
      return res.status(400).json({ message: 'User already booked this itinerary' });
    }

    itinerary.tourists.push(userId);
    await itinerary.save();

    res.status(200).json({ message: 'Itinerary booked successfully', itinerary });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCompleteEvents = async (req, res) => {
  try {
    const userId = req.params.id;

    // Retrieve activities
    const activities = await Activity.find({
      tourists: userId,
      isComplete: true
    });

    // Retrieve itineraries
    const itineraries = await Itinerary.find({
      tourists: userId,
      isComplete: true
    });

    res.status(200).json({ activities, itineraries });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

const addCommentAndRating = async (req, res) => {
  try {
    const { itemId, type, comment, rating, role } = req.body;

    // Determine the appropriate model based on item type
    const Model = type === 'activity' ? Activity : Itinerary;

    const item = await Model.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Define fields based on the role
    let commentsField, ratingField, counterField;

    if (role === 'Advertiser') {
      commentsField = 'advertiserComments';
      ratingField = 'advertiserRating';
      counterField = 'advertiserCounter';
    } else if (role === 'Tour Guide') {
      commentsField = 'tourGuideComments';
      ratingField = 'tourGuideRating';
      counterField = 'tourGuideCounter';
    } else {
      commentsField = 'comments';
      ratingField = 'rating';
      counterField = 'counter';
    }

    // Ensure the counter field is initialized
    if (!item[counterField]) {
      item[counterField] = 0;
    }

    // Add comment and update rating
    item[commentsField].push(comment);
    item[counterField] += 1;
    item[ratingField] = (item[ratingField] * (item[counterField] - 1) + rating) / item[counterField];

    await item.save();

    res.status(200).json({ message: 'Comment and rating added successfully' });
  } catch (error) {
    console.error('Error adding comment and rating:', error);
    res.status(500).json({ message: 'Error adding comment and rating', error });
  }
};

const saveActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { isSaved: true },
      { new: true }
    );
    if (!updatedActivity) return res.status(404).json({ message: 'Activity not found' });
    res.status(200).json({ message: 'Activity saved', updatedActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      { isSaved: true },
      { new: true }
    );
    if (!updatedItinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.status(200).json({ message: 'Itinerary saved', updatedItinerary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewSaved = async (req, res) => {
  try {
    const activities = await Activity.find({ isSaved: true });
    const itineraries = await Itinerary.find({ isSaved: true });

    if (!activities || !itineraries) {
      return res.status(404).json({ message: 'Event not found'});
    }

    res.status(200).json({activities,itineraries});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
}

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

const receiveNotifications = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming the userId is passed in the request body
    console.log(userId);

    // Check if the user has requested notifications
    const tourist = await Tourist.findOne({ userId });
    await Tourist.findOneAndUpdate(
      { userId: userId },        // Query to find the document
      { $set: { isNotifyRequested: true } }, // Update operation
      { new: true }              // Return the updated document
    );
    if (!tourist || !tourist.isNotifyRequested) {
      return res.status(400).json({ message: 'Notification request not enabled for user' });
    }

    // Find activities that are saved and have booking open, where the userId is in the tourists array
    const activities = await Activity.find({
      isSaved: true,
      isBookingOpen: true,
      tourists: { $in: [userId] } // Make sure 'tourists' holds userIds of tourists
    });

    if (!activities.length) {
      return res.status(404).json({ message: 'No activities available for notification' });
    }
    // Create and save the notification
    const newNotification = new Notification({
      userId: userId,
      description: 'You have new activities that are saved and have open bookings!'
    });
    await newNotification.save();

    res.status(200).json({ message: 'Notifications enabled for saved activities with open booking' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enabling notifications' });
  }
};






  

module.exports = { getTouristProfile, updateTouristProfile, getAll, bookActivity, bookItinerary, getCompleteEvents, addCommentAndRating, saveActivity, saveItinerary, viewSaved, getNotifications, receiveNotifications };
