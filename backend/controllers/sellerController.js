const Worker = require('../models/Worker');

// Fetch Seller Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get userId from route params
    const worker = await Worker.findOne({ userId });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ profile: worker.sellerProfile, userId: worker.userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Seller Profile
const updateProfile = async (req, res) => {
  const { name, description } = req.body;

  try {
    const worker = await Worker.findOneAndUpdate(
      { userId: req.params.id }, // Use req.params.id to get the userId
      { $set: { 'sellerProfile.name': name, 'sellerProfile.description': description } },
      { new: true }
    );

    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    res.json({ message: 'Profile updated successfully', profile: worker.sellerProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
