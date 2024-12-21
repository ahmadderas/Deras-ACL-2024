# Tourism Management System

## Motivation

The motivation behind this project is to create a platform that connects tourists with local services such as tour guides, activities, and events. The aim is to simplify the booking process, provide easy interfaces for both users and administrators, and enhance the management of resources by both admins and service providers.

## Build Status

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com)

## Code Style

The project follows the following coding conventions:
- **JavaScript (ES6+)** is used for both frontend and backend development.
- **React (Frontend):** Components are functional with hooks for managing state.
- **Express (Backend):** API routes are managed using Express.js.
- **MongoDB (Database):** For data storage and retrieval using Mongoose ORM.
- **Prettier and ESLint:** For consistent code formatting and linting.

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
