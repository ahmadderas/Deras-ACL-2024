const MuseumHistoricalPlace = require('../models/museumHistorical/MuseumHistoricalPlace');
const HistoricalTag = require('../models/museumHistorical/HistoricalTag');

// Create a new museum or historical place
const createMuseumHistoricalPlace = async (req, res) => {
  try {
    const { historicalTag, ...otherFields } = req.body;

    // If historicalTag is provided, ensure it is a valid ObjectId
    let historicalTagObj = null;
    if (historicalTag) {
      historicalTagObj = await HistoricalTag.findById(historicalTag);
      if (!historicalTagObj) return res.status(404).json({ message: 'Historical tag not found' });
    }

    const museumHistoricalPlace = new MuseumHistoricalPlace({ ...otherFields, historicalTag: historicalTagObj });
    await museumHistoricalPlace.save();
    res.status(201).json(museumHistoricalPlace);
  } catch (error) {
    res.status(400).json({ message: 'Error creating museum/historical place', error });
  }
};

// Get all museums and historical places
const getMuseumsHistoricalPlaces = async (req, res) => {
  try {
    const places = await MuseumHistoricalPlace.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

// Update a museum or historical place
const updateMuseumHistoricalPlace = async (req, res) => {
  const { id } = req.params;
  try {
    const { historicalTag, ...otherFields } = req.body;

    // If historicalTag is provided, ensure it is a valid ObjectId
    let historicalTagObj = null;
    if (historicalTag) {
      historicalTagObj = await HistoricalTag.findById(historicalTag);
      if (!historicalTagObj) return res.status(404).json({ message: 'Historical tag not found' });
    }

    const updatedPlace = await MuseumHistoricalPlace.findByIdAndUpdate(id, { ...otherFields, historicalTag: historicalTagObj }, { new: true });
    if (!updatedPlace) return res.status(404).json({ message: 'Museum/Historical place not found' });
    res.json(updatedPlace);
  } catch (error) {
    res.status(400).json({ message: 'Error updating museum/historical place', error });
  }
};

// Delete a museum or historical place
const deleteMuseumHistoricalPlace = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPlace = await MuseumHistoricalPlace.findByIdAndDelete(id);
    if (!deletedPlace) return res.status(404).json({ message: 'Museum/Historical place not found' });
    res.json({ message: 'Museum/Historical place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting museum/historical place', error });
  }
};

// Get all historical tags
const getHistoricalTags = async (req, res) => {
  try {
    const historicalTags = await HistoricalTag.find(); // Fetch all tags from the database
    res.status(200).json(historicalTags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// Create a new historical tag (now only requires 'name' field)
const createHistoricalTag = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const historicalTag = new HistoricalTag({ name });
    await historicalTag.save();  // Save the new tag instance
    res.status(201).json(historicalTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating tag' });
  }
};

// Update a historical tag by ID
const updateHistoricalTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const historicalTag = await HistoricalTag.findByIdAndUpdate(id, { name }, { new: true });
    if (!historicalTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json(historicalTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating tag' });
  }
};

// Delete a historical tag by ID
const deleteHistoricalTag = async (req, res) => {
  const { id } = req.params;

  try {
    const historicalTag = await HistoricalTag.findByIdAndDelete(id);
    if (!historicalTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting tag' });
  }
};

module.exports = {
  createMuseumHistoricalPlace,
  getMuseumsHistoricalPlaces,
  updateMuseumHistoricalPlace,
  deleteMuseumHistoricalPlace,
  getHistoricalTags,
  createHistoricalTag,
  updateHistoricalTag,
  deleteHistoricalTag
};
