import React, { useEffect, useState } from 'react';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]); // To track the wishlist

  // Fetch active products and the user's wishlist when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/tourist/view-products'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch products.');
        }
        const data = await response.json();
        setProducts(data); // Set the products data in the state
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products.');
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
      if (!userId) return;

      try {
        const response = await fetch(`/api/tourist/view-wishlist/${userId}`); // API endpoint to get user's wishlist
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist.');
        }
        const data = await response.json();
        setWishlist(data); // Set the wishlist data in the state
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
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

  // Handle Add to Wishlist button click
  const handleAddToWishlist = async (productId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      alert('Please log in to add items to the wishlist.');
      return;
    }

    try {
      const response = await fetch('/api/tourist/add-to-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await response.json(); // Get the response data

      if (data.isWishlisted) {
        alert('Product is already in wishlist.');
      } else {
        // Update the wishlist state if the product is added successfully
        setWishlist((prevWishlist) => [...prevWishlist, productId]);
        alert('Product added to wishlist successfully!');
      }
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

  // If no products found
  if (products.length === 0) {
    return <div>No active products found.</div>;
  }

  return (
    <div>
      <h1>Active Products</h1>
      <div className="products-list">
        {products.map((product) => {
          const isWishlisted = wishlist.includes(product._id); // Check if the product is already in the wishlist

          return (
            <div key={product._id} className="product-card">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Available: {product.availableCount}</p>
              <div>
                {/* Add to Cart Button */}
                <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                {/* Add to Wishlist Button */}
                <button
                  onClick={() => handleAddToWishlist(product._id)}
                  disabled={isWishlisted} // Disable button if already wishlisted
                >
                  {isWishlisted ? 'Already in Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewProducts;
