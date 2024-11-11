import React from 'react';

const TourSystemDemo = () => {
  return (
    <div className="demo-container">
      <h1>Welcome to the Tourist/Guest System!</h1>
      <p>
        Here's a step-by-step guide to help you navigate through all the available features:
      </p>

      <h2>1. Sign Up/Registration</h2>
      <p>
        New to the system? Register as a tourist by providing your details such as email, username, password, mobile number, nationality, date of birth, and job/student status.
        If you're under 18, you won't be able to make bookings.
      </p>

      <h2>2. Login</h2>
      <p>
        If you have an account, log in with your username and password. Forgot your password? Reset it using an OTP sent to your email.
      </p>

      <h2>3. Browse Activities, Itineraries, and Historical Places</h2>
      <p>
        Search for specific activities, itineraries, or historical places by name, category, or tags. You can filter results by budget, date, category, and ratings. Sort by price or ratings.
      </p>

      <h2>4. Save and Share Events</h2>
      <p>
        Bookmark or save your favorite events to view them later. You can also share activities, museums, and itineraries via link or email.
      </p>

      <h2>5. Book Events, Itineraries, and Activities</h2>
      <p>
        Find an event or itinerary you like and book it using your preferred payment method. After payment, a receipt will be sent to your email.
      </p>

      <h2>6. Profile Management</h2>
      <p>
        View and update your profile (except for username and wallet). Manage your personal information in the system.
      </p>

      <h2>7. Cancel and Refund</h2>
      <p>
        If you need to cancel a booking, do so within 48 hours of the event. The amount will be refunded to your wallet.
      </p>

      <h2>8. Notifications</h2>
      <p>
        Get notifications for upcoming events, bookings, cancellations, or when an event starts taking bookings.
      </p>

      <h2>9. Rating and Feedback</h2>
      <p>
        After attending an event or completing a tour, rate and comment on your experience to help others.
      </p>

      <h2>10. Promotions and Loyalty</h2>
      <p>
        Earn loyalty points for every payment, which can be redeemed for discounts. On your birthday, receive a promo code for discounts.
      </p>
    </div>
  );
}

export default TourSystemDemo;
