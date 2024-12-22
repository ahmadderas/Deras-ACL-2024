import React, { useEffect, useState } from 'react';

const ViewWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the wishlist when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
      if (!userId) {
        setError('Please log in to view your wishlist.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tourist/view-wishlist/${userId}`); // API endpoint to get wishlist
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist.');
        }
        const data = await response.json();
        setWishlist(data); // Set the wishlist items in the state
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch wishlist.');
        setLoading(false);
      }
    };

    fetchWishlist();
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

      alert('Product added to cart successfully!');
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  // Handle Remove from Wishlist button click
  const handleRemoveFromWishlist = async (productId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      alert('Please log in to remove items from the wishlist.');
      return;
    }

    try {
      const response = await fetch('/api/tourist/remove-from-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from wishlist.');
      }

      // Remove the product from the state after successful removal
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.product._id !== productId)
      );

      alert('Product removed from wishlist successfully!');
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

  // If no products in wishlist
  if (wishlist.length === 0) {
    return <div>Your wishlist is empty.</div>;
  }

  return (
    <div>
      <h1>Your Wishlist</h1>
      <div className="wishlist">
        {wishlist.map((item) => {
          return (
            <div key={item.product._id} className="wishlist-item">
              <h2>{item.product.name}</h2>
              <p>{item.product.description}</p>
              <p>Price: ${item.product.price}</p>
              <div>
                {/* Add to Cart Button */}
                <button onClick={() => handleAddToCart(item.product._id)}>
                  Add to Cart
                </button>
                {/* Remove from Wishlist Button */}
                <button onClick={() => handleRemoveFromWishlist(item.product._id)}>
                  Remove from Wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewWishlist;
