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

## Installation

### Prerequisites

1. **Node.js**  
   Ensure you have Node.js (v16 or higher) installed on your system.  
   Download it from [Node.js Official Website](https://nodejs.org/).

2. **MongoDB**  
   Set up a local MongoDB instance or use a cloud-based MongoDB service.  
   Download MongoDB from [MongoDB Official Website](https://www.mongodb.com/).

3. **Git** (optional)  
   Install Git to clone the repository:  
   [Download Git](https://git-scm.com/).

---

### Steps

1. **Clone the Repository**  
   Open your terminal or command prompt and run:  
   ```bash
   git clone https://github.com/ahmadderas/Deras-ACL-2024.git

2. **Navigate to the backend folder**
   ```bash
   cd backend

3. **Install the backend dependenceis**
   ```bash
   npm install

4. **Navigate to the frontend folder**
   Open another terminal
   ```bash
   cd frontend

5. **Install the frontend dependencies**
   ```bash
   npm install

6. **Create a .env file in the backend folder**
```env
PORT = your port
MONGO_URI = your mongo_uri
JWT_SECRET= your jwt_secret
EMAIL_USER = your system email (The one that handles sending email notifications to users)
EMAIL_PASS = your system email's password

```

7. **Run the backend server using the following commands successively**
   ```bash
   cd backend
   npm run dev

8. **Run the frontend components using the following commands successively**
   ```bash
   cd frontend
   npm start

And you're good to go.

## How To Use

- **Sign Up:** Choose to sign up based on your desired role (tourist/advertiser/seller/tour guide)
- **Login:** Login using your created credentials in the previous step
- **Update Profile:** You can update your personal info by clicking on the update profile button on the homepage.
- **Admin:** You can add/manage/delete users and manage activities, itineraries, products with their tags in addition to creating promocodes through each specified button in the homepage. For example, if you want to see how much users you have on the system you can click on user management where you have multiple options of adding an admin or a tourism governor in addition to accepting workers' signup requests, you'll go for the option where you click view no. of users and it will show you how many users you have in total and how many new users you get on the website per month.
- **Tourist:** You can book an activity/itinerary by clicking on events & historical places. From there, you can book/save events that interest you. You can also buy whatever products you like by clicking on view products button on the home page, you can choose to add a product to your wishlist or directly to your cart with the amount you like. Then, you can proceed to checkout your items using your preferred way of payment (COD, credit card or payment through the website's online wallet).
- **Tour Guide:** You can add/view/edit/delete any of your itineraries after clicking on the itineraries button.
- **Advertiser:** You can add/view/edit/delete any of your activites after clicking on the activvities button, in addition to adding activity tags.
- **Tourism Governor:** You can add/view/edit/delete any of your historical places/museums by clicking on the view museums/historical places button, in addition to adding and managing the preference tags.
- **Seller:** You can add/view/edit/archive/unarchive any of your products after clicking on the view products button on the home page.

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

