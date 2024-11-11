const User = require('../models/User'); // Assuming User schema is defined in models/User
const Worker = require('../models/Worker');
const Tourist = require('../models/Tourist');
const Activity = require('../models/activity/Activity');
const Itinerary = require('../models/Itinerary');
const Tag = require('../models/Tag');
const Category = require('../models/activity/Category');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

const addAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user with role 'Admin'

    hashedPassword = await bcrypt.hash(password,10);
    const newAdmin = new User({
      username,
      password,
      role: 'Admin',
    });


    
    // Save the new admin
    await newAdmin.save();
    res.status(201).json({ message: 'Admin added successfully' });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addGovernor = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username already exists
      const existingGovernor = await User.findOne({ username });
      if (existingGovernor) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Create a new user with role 'Admin'
  
      hashedPassword = await bcrypt.hash(password,10);
      const newGovernor = new User({
        username,
        password,
        role: 'Tourism Governor',
      });
  
  
      
      // Save the new admin
      await newGovernor.save();
      res.status(201).json({ message: 'Tourism governor added successfully' });
    } catch (error) {
      console.error('Error adding governor:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const viewSignupRequests = async (req, res) => {
    try {
      const workers = await Worker.find({ accepted: false, rejected:false });
      res.status(200).json(workers);
    } catch (error) {
      console.error('Error retrieving signup requests:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const acceptWorker = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedWorker = await Worker.findByIdAndUpdate(
        id,
        { accepted: true, rejected: false },
        { new: true }
      );
      if (!updatedWorker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      res.status(200).json({ message: 'Worker accepted successfully' });
    } catch (error) {
      console.error('Error accepting worker:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  const rejectWorker = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedWorker = await Worker.findByIdAndUpdate(
        id,
        { accepted: false, rejected: true },
        { new: true }
      );
      if (!updatedWorker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      res.status(200).json({ message: 'Worker rejected successfully' });
    } catch (error) {
      console.error('Error rejecting worker:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const viewUsers = async (req, res) => {
    try {
      const tourists = await Tourist.find({});
      const workers = await Worker.find({});
      const governors = await User.find({ role: 'Tourism Governor' });
  
      res.status(200).json({
        tourists,
        workers,
        governors
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ message: 'Server error retrieving users' });
    }
  };
  

  const deleteUser = async (req, res) => {
    const { type, id } = req.params;  // "type" is either 'tourists', 'workers', or 'governors'
  
    try {
      let model;
  
      if (type === 'tourists') {
        model = Tourist;  // Tourist schema
      } else if (type === 'workers') {
        model = Worker;  // Worker schema
      } else if (type === 'governors') {
        // If the user is a Tourism Governor, delete them from the User schema
        await User.findByIdAndDelete(id);  // Delete Tourism Governor from User schema
        return res.status(200).json({ message: 'Tourism Governor deleted successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid user type' });  // Handle invalid types
      }
  
      // For 'tourists' and 'workers', also delete from User schema
      const user = await model.findById(id).select('userId');  // Find the userId reference
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Delete the user from the User schema
      await User.findByIdAndDelete(user.userId);  // Delete user from User schema
  
      // Now delete the user from the corresponding model (Tourist or Worker)
      await model.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name } = req.body; // Destructure category name from request body

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Create a new category
    const newCategory = new Category({ name });

    // Save the new category to the database
    await newCategory.save();

    // Return success response
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};


// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error retrieving tags:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new tag
const createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  try {
    const newTag = new Tag({ name });
    await newTag.save();
    res.status(201).json({ message: 'Tag created successfully', tag: newTag });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a tag
const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedTag = await Tag.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag updated successfully', tag: updatedTag });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a tag
const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get total number of users and number of users per month
const getUserStats = async (req, res) => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments();

    // Get number of users per month (using aggregation)
    const usersPerMonth = await User.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' }, // Group by month
          count: { $sum: 1 } // Count users for each month
        }
      },
      {
        $sort: { _id: 1 } // Sort by month
      }
    ]);

    res.json({
      totalUsers,
      usersPerMonth
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getActivitiesItineraries = async (req, res) => {
  try {
    const activities = await Activity.find();
    const itineraries = await Itinerary.find();
    res.json({ activities, itineraries });
  } catch (error) {
    console.error('Error retrieving activities and itineraries:', error);
    res.status(500).json({ error: 'Failed to retrieve activities and itineraries' });
  }
};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const flagInappropriate = async (req, res) => {
  const { id, type } = req.params;

  try {
    let flaggedItem;
    let userId;

    // Check if it's an activity or itinerary and fetch the respective data
    if (type === 'activity') {
      flaggedItem = await Activity.findById(id);
      userId = flaggedItem.userId;
      console.log(userId);  // The userId of the activity's creator
    } else if (type === 'itinerary') {
      flaggedItem = await Itinerary.findById(id);
      userId = flaggedItem.userId;
      console.log(userId);  // The userId of the itinerary's creator
    }

    // Flag the item as inappropriate by updating the isAppropriate field
    flaggedItem.isAppropriate = false;
    await flaggedItem.save();

    // Fetch the user's email using the userId
    const user = await Worker.findOne({userId});
    const email = user.email;

    // Send an email to the user notifying them about the flag
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Receiver's email address
      subject: 'Event Flagged', // Email subject
      text: 'Your event has been flagged inappropriate', // Email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    // Create a new notification for the user
    const newNotification = new Notification({
      userId: userId,  // The userId of the person who created the activity/itinerary
      description: 'Your event has been flagged inappropriate'
    });

    // Save the new notification
    await newNotification.save();

    return res.status(200).json({ message: 'Item flagged as inappropriate and email sent' });
  } catch (error) {
    console.error('Error flagging item as inappropriate:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


  

module.exports = { addAdmin, addGovernor, viewSignupRequests, acceptWorker, rejectWorker, viewUsers, deleteUser, getCategories, createCategory, updateCategory, deleteCategory, getTags, createTag, updateTag, deleteTag, getUserStats, getActivitiesItineraries, flagInappropriate };
