const Worker = require('../models/Worker');
const Itinerary = require('../models/Itinerary');
const Notification = require('../models/Notification');

// Fetch Tour Guide Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from route params
    const worker = await Worker.findOne({ userId });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ profile: worker.tourGuideProfile, userId: worker.userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Tour Guide Profile
const updateProfile = async (req, res) => {
  const { mobileNumber, previousWork, yearsOfExperience } = req.body;

  try {
    const worker = await Worker.findOneAndUpdate(
      { userId: req.params.id }, // Use req.params.id to get the userId
      { $set: { 'tourGuideProfile.mobileNumber': mobileNumber, 'tourGuideProfile.previousWork': previousWork, 'tourGuideProfile.yearsOfExperience': yearsOfExperience } },
      { new: true }
    );

    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    res.json({ message: 'Profile updated successfully', profile: worker.tourGuideProfile });
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

// Create a new itinerary
const createItinerary = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      activities, 
      durations, 
      timeline, 
      language, 
      price, 
      availableDates, 
      locations, 
      accessibility, 
      pickupLocation, 
      dropoffLocation 
    } = req.body;

    const newItinerary = new Itinerary({
      activities,
      durations,
      timeline,
      language,
      price,
      availableDates,
      locations,
      accessibility,
      pickupLocation,
      dropoffLocation,
      userId
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all itineraries
const getItineraries = async (req, res) => {
  try {
    const  {userId } = req.params;
    const itineraries = await Itinerary.find({ userId });
    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update an itinerary
const updateItinerary = async (req, res) => {
  const { id } = req.params;
  const {
    activities, 
    durations, 
    timeline, 
    language, 
    price, 
    availableDates, 
    locations, 
    accessibility, 
    pickupLocation, 
    dropoffLocation
  } = req.body;

  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(id, {
      activities,
      durations,
      timeline,
      language,
      price,
      availableDates,
      locations,
      accessibility,
      pickupLocation,
      dropoffLocation,
    }, { new: true });

    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json(updatedItinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an itinerary
const deleteItinerary = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(id);

    if (!deletedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getNotifications
};
