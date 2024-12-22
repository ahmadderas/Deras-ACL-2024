const express = require('express');
const { getTouristProfile, updateTouristProfile, getAll, bookActivity, bookItinerary, getCompleteEvents, addCommentAndRating, saveActivity, saveItinerary, viewSaved ,getNotifications, receiveNotifications, addToCart, addToWishlist, getWishlist, removeFromWishlist, viewCart, removeFromCart, decrementFromCart, getWalletBalance, createOrder, viewOrders, cancelOrder, getComplaints, fileComplaint } = require('../controllers/touristController');
const { viewProducts } = require('../controllers/sellerController');
const router = express.Router();

//Get user profile
router.get('/update-profile/:id', getTouristProfile);

//Get notifications
router.get('/notifications/:id', getNotifications);

//Update user profile
router.patch('/update-profile/:id', updateTouristProfile);

//View events and historical places
router.get('/view-all', getAll);

//Book activity
router.post('/book-activity/:id', bookActivity);

//Book itinerary
router.post('/book-itinerary/:id', bookItinerary);

//Get complete events
router.get('/comments/:id', getCompleteEvents);

//Add comments
router.post('/comments/add', addCommentAndRating);

//Save activity
router.post('/save-activity/:id', saveActivity);

//Save Itinerary
router.post('/save-itinerary/:id', saveItinerary);

//Get saved events
router.get('/view-saved', viewSaved);

//Request to receive notifications
router.patch('/receive-notifications/:id', receiveNotifications );

//View products
router.get('/view-products', viewProducts);

// Add product to cart
router.post('/add-to-cart', addToCart);

// Add product to wishlist
router.post('/add-to-wishlist', addToWishlist);

//View wishlist
router.get('/view-wishlist/:userId', getWishlist)

//Remove a product from wishlist
router.post('/remove-from-wishlist', removeFromWishlist);

//View cart
router.get('/view-cart/:userId', viewCart);

//Remove product from cart
router.post('/remove-from-cart', removeFromCart);

//Reduce product quantity from cart
router.post('/decrement-from-cart', decrementFromCart);

//Get wallet balance
router.get('/wallet/:userId', getWalletBalance);

// Route to create an order
router.post('/create-order/:userId', createOrder);

//Get orders
router.get("/view-orders/:userId", viewOrders);

// Cancel an order
router.patch("/cancel-order/:orderId", cancelOrder);

//Get complaints
router.get('/get-complaints/:id', getComplaints);

//File a complaint
router.post('/file-complaint', fileComplaint);



module.exports = router;
