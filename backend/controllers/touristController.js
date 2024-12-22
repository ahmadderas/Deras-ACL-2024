const Tourist = require('../models/Tourist');  
const Activity = require('../models/activity/Activity');
const Itinerary = require('../models/Itinerary');
const HistoricalPlace = require('../models/museumHistorical/MuseumHistoricalPlace');
const HistoricalTag = require('../models/museumHistorical/HistoricalTag');
const Category = require('../models/activity/Category');
const Tag = require('../models/Tag');
const Worker = require('../models/Worker');
const Product = require('../models/Product');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Complaint = require('../models/Complaint');


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
    const  userId  = req.params.id;
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

// Fetch all active (non-archived) products for a tourist
const viewProducts = async (req, res) => {
  try {
    // Fetch products where isArchived is false (active products)
    const products = await Product.find({ isArchived: false });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No active products found.' });
    }

    res.status(200).json(products); // Return the active products
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const tourist = await Tourist.findOne({ userId });
    console.log(userId);
    console.log(productId);
    console.log(tourist);

    // Check if product is already in the wishlist
    const isInWishlist = tourist.wishlist.some(item => item.product.toString() === productId);

    // Send the isWishlisted boolean to the frontend
    if (isInWishlist) {
      return res.status(200).json({ isWishlisted: true }); // Product is already in the wishlist
    }

    // If not already in wishlist, add it
    tourist.wishlist.push({ product: productId });
    await tourist.save();

    res.status(200).json({ isWishlisted: false }); // Product was successfully added to wishlist
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
};


// Add product to cart
const addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const tourist = await Tourist.findOne({ userId });
    console.log(userId);
    console.log(productId);
    console.log(tourist);

    // Check if product is already in the cart
    const cartItem = tourist.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      cartItem.count += 1; // Increment quantity
    } else {
      tourist.cart.push({ product: productId, count: 1 });
    }

    await tourist.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// Backend: Get wishlist for a specific tourist, including full product details
const getWishlist = async (req, res) => {
  const { userId } = req.params; // Extract userId from the request parameters
  try {
    // Find the tourist by userId
    const tourist = await Tourist.findOne({ userId })
      .populate({
        path: 'wishlist.product', // Populate the 'product' field in wishlist with product details
        model: 'Product', // The Product model
        select: 'name description price' // Select the fields you need from the Product model
      });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const wishlist = tourist.wishlist; // This will now contain the full product details
    res.status(200).json(wishlist); // Send the wishlist with product details to the frontend
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body; // Get userId and productId from the request body

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findOne({ userId });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Remove the product from the wishlist using $pull
    tourist.wishlist = tourist.wishlist.filter(
      (item) => item.product.toString() !== productId
    );

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
};

// Controller method to fetch cart items
const viewCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the tourist by userId and populate the cart with product details
    const tourist = await Tourist.findOne({ userId })
      .populate('cart.product'); // Populate the product details for each item in the cart
    
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.status(200).json(tourist.cart); // Return the cart data
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Controller method to remove an item from the cart
const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the tourist by userId and remove the product from the cart
    const tourist = await Tourist.findOne({ userId });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Find the product in the cart and remove it
    const index = tourist.cart.findIndex(item => item.product.toString() === productId);
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    tourist.cart.splice(index, 1); // Remove the product from the cart
    await tourist.save();

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};

// Add product to cart
const decrementFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const tourist = await Tourist.findOne({ userId });
    console.log(userId);
    console.log(productId);
    console.log(tourist);

    // Check if product is already in the cart
    const cartItem = tourist.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      cartItem.count -= 1; // Increment quantity
    }

    await tourist.save();

    res.status(200).json({ message: 'Product quantity reduced successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reduce product quantity to cart' });
  }
};


const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const tourist = await Tourist.findOne({ userId });
    console.log(userId);
    console.log(tourist);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const createOrder = async (req, res) => {
  const { userId } = req.params;
  const { deliveryAddress, paymentMethod, cart, totalAmount } = req.body;

  try {
    // Find the tourist by userId
    const tourist = await Tourist.findOne({ userId });
    console.log(userId);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    // Prepare email service (e.g., nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS,   // Replace with your email password
      },
    });

    // Function to send emails
    const sendEmailNotification = (email, productName) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Product Out of Stock',
        text: `${productName} is now out of stock. Please update your inventory.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    };

    // Update the stock of products based on the items in the cart
    for (let item of cart) {
      const { product, count } = item;

      // Find the product by productId
      const productItem = await Product.findById(product);
      if (productItem) {
        // Check if the available stock is sufficient
        if (productItem.availableCount < count) {
          // If not enough stock, send a response with an error message
          return res.status(400).json({
            success: false,
            message: `Desired quantity for ${productItem.name} exceeds available stock. Only ${productItem.availableCount} items are available.`,
          });
        }

        // Decrease the product count by the count ordered
        productItem.availableCount -= count;

        // If the product is out of stock, notify the seller and admins
        if (productItem.availableCount <= 0) {
          // Notify the seller of the product
          const sellerId = productItem.seller;
          const sellerItem = await Worker.findOne({ userId: sellerId });
          console.log(sellerItem.email);
          sendEmailNotification(sellerItem.email, productItem.name);

          // Add notification records for the seller
          const sellerNotification = new Notification({
            description: `${productItem.name} is out of stock`, // Update message to description
            userId: sellerItem.userId,  // Reference the seller's userId
          });
          await sellerNotification.save();

          const admins = await User.find({ role: 'Admin' });
          // Add notification for all admins
          for (let admin of admins) {
            const adminNotification = new Notification({
              description: `${productItem.name} is out of stock`, // Update message to description
              userId: admin._id,  // Reference admin's userId
            });
            await adminNotification.save();
          }
        }

        // Save the updated product back to the database
        await productItem.save();
      } else {
        console.log(`Product with ID ${product} not found`);
      }
    }

    // Create a new order document after all cart items are processed
    const newOrder = new Order({
      deliveryAddress,
      paymentMethod,
      cart,
      totalAmount,
      status: 'In Progress', // Default status when the order is created
      tourist: userId, // Reference the tourist
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    console.log(savedOrder);

    // If the payment method is Wallet, update the wallet balance
    if (paymentMethod === "Wallet") {
      const newBalance = tourist.wallet - totalAmount;
      tourist.wallet = newBalance;
      await tourist.save();
    }

    // After successful order, empty the cart of the tourist
    tourist.cart = [];  // Set the cart to an empty array
    await tourist.save();  // Save the tourist document with the empty cart

    // Send back the created order response
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};




// Example API route to get orders by tourist userId
const viewOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all orders where the tourist field matches the userId
    const orders = await Order.find({ tourist: userId }).populate('cart.product'); // Populate cart product details if necessary

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this tourist' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status to "Cancelled"
    order.status = 'Cancelled';
    await order.save(); // Save the updated order

    // Check if the payment method is either "Wallet" or "Credit Card"
    if (order.paymentMethod === 'Wallet' || order.paymentMethod === 'Credit Card') {
      // Find the tourist based on the userId from the order
      const tourist = await Tourist.findOne({ userId: order.tourist });
      console.log(order);
      console.log(order.tourist);

      if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found' });
      }

      // Increment the tourist's wallet by the order's total amount
      tourist.wallet += order.totalAmount;
      await tourist.save(); // Save the updated wallet balance
    }

    // Return a success response with the updated order
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to cancel the order' });
  }
};

const getComplaints = async (req, res) => {
  try {
    const   userId   = req.params.id;
    console.log(userId);

    // Fetch complaints where the tourist field matches the given ID
    const complaints = await Complaint.find({ tourist: userId });
    console.log(userId);
    console.log(complaints);

    // If no complaints are found, return a 404 response
    if (!complaints.length) {
      return res.status(404).json({ message: 'No complaints found for this tourist' });
    }

    // Return the complaints in the response
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error retrieving complaints:', error);
    res.status(500).json({ message: 'Error retrieving complaints' });
  }
};

const fileComplaint = async (req, res) => {
  try {
    const { title, body, userId } = req.body;
    console.log(userId);

    // Create a new complaint
    const newComplaint = new Complaint({ title, body, tourist: userId });
    await newComplaint.save();

    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('Error filing complaint:', error);
    res.status(500).json({ message: 'Error filing complaint' });
  }
};



  

module.exports = { getTouristProfile, updateTouristProfile, getAll, bookActivity, bookItinerary, getCompleteEvents, addCommentAndRating, saveActivity, saveItinerary, viewSaved, getNotifications, receiveNotifications, viewProducts, addToCart, addToWishlist, getWishlist, removeFromWishlist, viewCart, removeFromCart, decrementFromCart, getWalletBalance, createOrder, viewOrders, cancelOrder, getComplaints, fileComplaint };
