const bcrypt = require('bcrypt');
const User = require('../models/User');
const Tourist = require('../models/Tourist');
const Worker = require('../models/Worker');

const signup = async (req, res) => {
  // Destructure the request body
  const { username, email, password, role, mobileNumber, nationality, dob, jobOrStudent, jobTitle, role2 } = req.body;


  // Check if the email or username already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const existingTourist = await Tourist.findOne({ username });
    if (existingTourist) {
      return res.status(400).json({ message: 'Tourist with this username already exists' });
    }

    const existingWorker = await Worker.findOne({ username });
    if(existingWorker) {
        return res.status(400).json({ message: 'Worker with this username already exists'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the main User document
    const user = new User({ username, email, password, role });
    await user.save();

    // Create role-specific document based on the role
    let roleDocument;
    if (role2 === 'Tourist') {
      roleDocument = new Tourist({
        userId: user._id,
        email,
        DOB: dob,
        mobileNumber,
        occupation: jobOrStudent === 'Student' ? 'Student' : jobTitle,
        nationality,
        username, // Include the username here
      });
    } else if (role2 === 'Worker') {
      roleDocument = new Worker({
        userId: user._id,
        email,
        role,
        documents: [], // You may modify this based on your requirements
        accepted: false, // Default value for new workers
        username,
      });
    }

    // Save the role-specific document
    await roleDocument.save();

    // Link the role document to the User document
    user.roleRef = roleDocument._id;
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

module.exports = { signup };
