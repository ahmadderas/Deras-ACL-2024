import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const ViewCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch the cart when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
      if (!userId) {
        setError('Please log in to view your cart.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tourist/view-cart/${userId}`); // API endpoint to get cart
        if (!response.ok) {
          throw new Error('Failed to fetch cart.');
        }
        const data = await response.json();
        setCart(data); // Set the cart items in the state
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cart.');
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // Empty dependency array ensures it only runs once

  // Handle Add to Cart button click
  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      alert('Please log in to add items to the cart.');
      return;
    }

    try {
      const response = await fetch('/api/tourist/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart.');
      }

      // Update the cart state with the new count immediately after success
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product._id === productId
            ? { ...item, count: item.count + 1 } // Increase count by 1 after success
            : item
        )
      );

      alert('Product added to cart successfully!');
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  // Handle Remove from Cart button click
  const handleRemoveFromCart = async (productId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      alert('Please log in to remove items from the cart.');
      return;
    }

    try {
      const response = await fetch('/api/tourist/remove-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from cart.');
      }

      // Remove the product from the state after successful removal
      setCart((prevCart) =>
        prevCart.filter((item) => item.product._id !== productId)
      );

      alert('Product removed from cart successfully!');
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  // Handle Reduce Quantity button click
  const handleReduceQuantity = async (productId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      alert('Please log in to modify your cart.');
      return;
    }

    try {
      const response = await fetch('/api/tourist/decrement-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reduce quantity.');
      }

      const updatedCart = await response.json();
      // Update the cart state with the new count after reducing
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product._id === productId
            ? { ...item, count: item.count - 1 } // Decrease count by 1
            : item
        )
      );

      alert('Product quantity reduced!');
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>{error}</div>;
  }

  // If no products in cart
  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart">
        {cart.map((item) => {
          return (
            <div key={item.product._id} className="cart-item">
              <h2>{item.product.name}</h2>
              <p>{item.product.description}</p>
              <p>Price: ${item.product.price}</p>
              <p>Quantity: {item.count}</p>
              <div>
                {/* Add More Button */}
                <button onClick={() => handleAddToCart(item.product._id)}>
                  <i className="fa fa-plus"></i> {/* Font Awesome Plus Icon */}
                </button>
                {/* Reduce Quantity Button */}
                <button
                  onClick={() => handleReduceQuantity(item.product._id)}
                  disabled={item.count <= 1} // Disable if count is 1 or less
                >
                  <i className="fa fa-minus"></i> {/* Font Awesome Minus Icon */}
                </button>
                {/* Remove from Cart Button */}
                <button onClick={() => handleRemoveFromCart(item.product._id)}>
                  <i className="fa fa-trash"></i> {/* Font Awesome Trash Icon */}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Checkout Button */}
      <div>
        <button onClick={() => navigate('/tourist/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default ViewCart;
