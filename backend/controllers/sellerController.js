const Worker = require('../models/Worker');
const Product = require('../models/Product');

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

const viewProducts = async (req, res) => {
  try {
    const products = await Product.find()

    if (!products) {
      return res.status(404).json({ message: 'No products found for this seller.' });
    }

    res.status(200).json(products); // Return the products
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addProduct = async (req, res) => {
  const { name, description, price, availableCount, seller } = req.body;

  // Basic validation
  if (!name || !description || price <= 0 || availableCount < 0 || !seller) {
    return res.status(400).json({ message: 'Please fill out all required fields.' });
  }

  try {
    // Create a new product
    const newProduct = new Product({
      name,
      description,
      price,
      availableCount,
      seller,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with the created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Update product (patch method)
const updateProduct = async (req, res) => {
  const { productId } = req.params;  
  const { name, description, price, availableCount } = req.body;  // Extract fields from request body

  try {
    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product only with the allowed fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.availableCount = availableCount || product.availableCount;

    // Save the updated product
    await product.save();

    // Respond with the updated product
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Archive or Unarchive a product
const toggleProductArchive = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Toggle the isArchived field
    product.isArchived = !product.isArchived;

    // Save the updated product
    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  viewProducts,
  addProduct,
  updateProduct,
  toggleProductArchive
};
