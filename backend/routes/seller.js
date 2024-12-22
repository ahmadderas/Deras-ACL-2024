const express = require('express');
const { getProfile, updateProfile, viewProducts, addProduct, updateProduct, toggleProductArchive } = require('../controllers/sellerController');

const router = express.Router();

// Get Seller Profile
router.get('/profile/:id', getProfile);

// Update Seller Profile
router.patch('/update-profile/:id', updateProfile);

//View Products
router.get('/view-products/:id', viewProducts);

//Add a product
router.post('/add-product/:id',addProduct)

//Update a product
router.patch('/update-product/:productId', updateProduct);

//Archive a product
router.patch('/archive-product/:productId', toggleProductArchive);

//Unarchive a product
router.patch('/unarchive-product/:productId', toggleProductArchive);


module.exports = router;
