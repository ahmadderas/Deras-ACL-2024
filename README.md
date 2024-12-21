# Tourism Management System

## Motivation

The motivation behind this project is to create a platform that connects tourists with local services such as tour guides, advertisers, sellers, products, activities, and events. The aim is to simplify the booking process, provide easy interfaces for both users and administrators, and enhance the management of resources by both admins and service providers.

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
  - Axios (for HTTP requests)
  - Bootstrap / Material UI (for styling)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (for data storage)
  - JWT (JSON Web Tokens) for authentication
  - Mongoose (for MongoDB schema and queries)

- **Testing:**
  - Postman (for API testing)
  - Jest (for unit and integration tests)

## Features

- **User Management:** Admins can manage user profiles and roles (e.g., Admin, Tourist, Tour Guide, Advertiser, Seller).
- **Activity Management:** Admins can create, edit, and delete activities.
- **Tour Guides & Advertisers:** Allows managing tour guides, their activities, and their products/services.
- **Promo Codes:** Admins can create promo codes to apply discounts on bookings.
- **Event Management:** Admins can manage events that can be booked by users.
- **Notifications:** Admins can manage and view notifications related to the system.
- **Secure Login:** Role-based login for different users (Admin, Tourist, Advertiser, etc.).
- **Product Sharing:** Users can share products/events using unique links.

## Code Examples

```javascript
// Example of how to create a promo code
async function createPromoCode() {
  const response = await axios.post('/api/promoCodes', { code: 'SUMMER2024', usageLimit: 100 });
  console.log(response.data);
}
