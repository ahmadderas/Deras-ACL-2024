# Project Title

**Tourism Management System**

## Motivation

The motivation behind this project is to create a platform that connects tourists with local services, including tour guides, activities, and events, while providing an easy-to-use interface for administrators, users, and service providers. The goal is to streamline the booking process, enhance user experiences, and allow for easy management of resources by admins and users alike.


## Code Style

This project adheres to the following code styles and practices:
- **JavaScript (ES6+):** For all logic and interactions.
- **React (Frontend):** With hooks and functional components.
- **Express (Backend):** For routing and handling API requests.
- **MongoDB:** For database management.

Linting and formatting tools like **Prettier** and **ESLint** are configured to ensure consistent code style.

## Screenshots

![App Screenshot](./path/to/screenshot.png)  
*Example of how the admin dashboard looks in the project.*

![User Interface](./path/to/ui_screenshot.png)  
*Another screenshot showing the user-facing interface.*

## Tech/Framework Used

- **Frontend:**
  - React.js
  - React Router
  - HTML5, CSS3
  - Axios (for making HTTP requests)
  - Bootstrap / Material UI (for styling)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (for data storage)
  - JWT (JSON Web Tokens) for authentication
  - Mongoose (MongoDB ORM)

- **Testing:**
  - Postman (for API testing)
  - Jest (for unit and integration tests)

## Features

- **User Management:** Admin can manage user profiles and roles.
- **Activity Management:** Admin can create, update, and delete activities.
- **Tour Guides & Advertisers:** Allows for managing tour guides and activities from them.
- **Promotions:** Admin can create promo codes to apply to user orders.
- **Event Management:** View and manage events that can be booked.
- **Notifications:** Admin can manage and view notifications related to the system.
- **Secure Login:** Role-based login for different users (Admin, Tourists, Advertisers, etc.).
- **Product Sharing:** Users can share products and events via links.
  
## Code Examples

```javascript
// Example of an API request to create a new promo code
async function createPromoCode() {
  const response = await axios.post('/api/promoCodes', { code: 'SUMMER2024', usageLimit: 100 });
  console.log(response.data);
}
