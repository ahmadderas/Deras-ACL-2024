# Tourism Management System

## Motivation

The motivation behind this project is to create a platform that connects tourists with local services such as tour guides, advertisers, sellers, products, activities, and events. The aim is to simplify the booking process, provide easy interfaces for both users and administrators, and enhance the management of resources by both admins and service providers.

## Code Style

- **Naming Conventions**: Function and variable names follow **camelCase** notation, making them descriptive and easy to understand. For example: `getProfile`, `updateProfile`, `viewProducts`, `addProduct`.
  
- **Async/Await**: All asynchronous operations are handled using **async/await**, ensuring readability and better error handling.

- **Error Handling**: The code consistently uses **try/catch** blocks to manage errors in asynchronous operations. Proper HTTP status codes are returned to indicate success or failure (e.g., `200`, `201`, `400`, `404`, `500`).

- **Destructuring Assignment**: JavaScript destructuring is employed to extract values from objects for cleaner and more concise code. For example: `const { name, description } = req.body;`.

- **Template Literals**: **Template literals** are used for building strings dynamically, enhancing readability over traditional string concatenation. Example: `res.status(200).json({ message: 'Product updated successfully' });`.

- **Validation**: Input validation is done to ensure required fields are present and valid before performing database operations. For example: checking if `price > 0` and `availableCount >= 0`.

- **HTTP Status Codes**: Proper HTTP status codes are used for indicating the result of operations:
  - `200` for successful operations
  - `201` for resource creation
  - `400` for client errors
  - `404` for not found resources
  - `500` for server errors

- **Modularization**: The code is structured in a modular way, with each function serving a specific purpose. This makes the code more maintainable and scalable.

- **Consistent JSON Responses**: The API returns consistent JSON responses, either with a success message or the requested data, ensuring uniformity in the format.

## Tech/Framework Used

- **Frontend:**
  - React.js
  - React Router (for navigation)
  - HTML
  - CSS

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (for data storage)
  - Mongoose (for MongoDB schema and queries)

- **Testing:**
  - Postman (for API testing)

## Features

- **User Management:** Admins can manage user profiles and roles (e.g., Admin, Tourist, Tour Guide, Advertiser, Seller).
- **Activity Management:** Admins can create, edit, and delete activities.
- **Tourists:** Tourists can chose to book or buy activities,itineraries or products from a wide range of resources.
- **Tour Guides, Sellers & Advertisers:** Allows managing tour guides, their activities, and their products/services.
- **Promo Codes:** Admins can create promo codes to apply discounts on bookings.
- **Event Management:** Admins can manage events that can be booked by users.
- **Notifications:** Admins can manage and view notifications related to the system, as well as other users receiving them.
- **Secure Login:** Role-based login for different users (Admin, Tourist, Advertiser, etc.).

## API References

### 1. **Get Tourist Profile**
   - **Endpoint**: `GET /update-profile/:id`
   - **Description**: Retrieve the profile of a tourist based on their ID.
   
### 2. **Get Notifications**
   - **Endpoint**: `GET /notifications/:id`
   - **Description**: Get notifications for a tourist based on their ID.

### 3. **Update Tourist Profile**
   - **Endpoint**: `PATCH /update-profile/:id`
   - **Description**: Update the profile of a tourist.

### 4. **View All Events and Historical Places**
   - **Endpoint**: `GET /view-all`
   - **Description**: Retrieve a list of all events and historical places.

### 5. **Book Activity**
   - **Endpoint**: `POST /book-activity/:id`
   - **Description**: Book a specific activity for a tourist based on activity ID.

### 6. **Book Itinerary**
   - **Endpoint**: `POST /book-itinerary/:id`
   - **Description**: Book a specific itinerary for a tourist based on itinerary ID.

### 7. **Get Complete Events**
   - **Endpoint**: `GET /comments/:id`
   - **Description**: Retrieve all completed events related to a tourist.

### 8. **Add Comment and Rating**
   - **Endpoint**: `POST /comments/add`
   - **Description**: Add a comment and rating to an activity or event.

### 9. **Save Activity**
   - **Endpoint**: `POST /save-activity/:id`
   - **Description**: Save a specific activity to a tourist's profile.

### 10. **Save Itinerary**
   - **Endpoint**: `POST /save-itinerary/:id`
   - **Description**: Save a specific itinerary to a tourist's profile.

### 11. **View Saved Events**
   - **Endpoint**: `GET /view-saved`
   - **Description**: View all saved events and itineraries for a tourist.

### 12. **Receive Notifications**
   - **Endpoint**: `PATCH /receive-notifications/:id`
   - **Description**: Request to receive notifications for a tourist.

### 13. **View Products**
   - **Endpoint**: `GET /view-products`
   - **Description**: View all products available from sellers.

### 14. **Add Product to Cart**
   - **Endpoint**: `POST /add-to-cart`
   - **Description**: Add a product to a tourist's shopping cart.

### 15. **Add Product to Wishlist**
   - **Endpoint**: `POST /add-to-wishlist`
   - **Description**: Add a product to a tourist's wishlist.


## Code Examples

```javascript
// Example of how an admin creates a promo code
async function createPromoCode() {
  const response = await axios.post('/api/promoCodes', { code: 'SUMMER2024', usageLimit: 100 });
  console.log(response.data);
}

// Example of how an admin/seller archives a product
const toggleProductArchive = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isArchived = !product.isArchived;
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Example of how a tour guide updates his profile
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

// Example of how a tourist can view all activities and itineraries
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
```

## Build Status

Unfortunately some required features aren't implemented such as booking a hotel/flight using a 3rd party application, sharing an activity/itinerary using a copy link, receiving loyalty points.

## Credits

Netninja MERN stack playlist



## License

Nodemailer 6.9.16

