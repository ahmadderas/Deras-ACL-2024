import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]); // To store the fetched products
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To store error messages if any

  // States for adding and editing a product
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    availableCount: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null); // To store the product being edited

  // Filter, sort, and search states
  const [minPrice, setMinPrice] = useState(0); // Minimum price filter
  const [maxPrice, setMaxPrice] = useState(1000); // Maximum price filter
  const [sortBy, setSortBy] = useState('rating_desc'); // Sort by ratings (ascending or descending)
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering by name

  // Retrieve the userId from localStorage (assuming it's stored as "userId")
  const userId = localStorage.getItem('userId');
  console.log(userId);
  

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) {
        setError('User is not logged in!');
        setLoading(false);
        return;
      }

      try {
        // Admin can fetch all products without userId dependency
        const response = await fetch('/api/admin/view-products');
        const data = await response.json();

        if (response.ok) {
          setProducts(data); // If the response is successful, set the fetched products
        } else {
          setError(data.message || 'Error fetching products');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false); // Stop loading once the request is completed
      }
    };

    fetchProducts();
  }, [userId]); // Dependency array includes userId, so it fetches new data if userId changes

  // Handle the form input change for adding a product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle product submission
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newProduct, seller: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setProducts([...products, data]); // Add the new product to the list
        setNewProduct({ name: '', description: '', price: 0, availableCount: 0 }); // Clear the form
        setError(null); // Clear any previous errors
      } else {
        setError(data.message || 'Error adding product');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  // Handle product edit
  const handleEditProduct = (product) => {
    setEditingProduct(product); // Set the product to be edited
    setNewProduct({ ...product }); // Populate the form with the product data
  };

  // Handle update product submission (use PATCH)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/update-product/${newProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          availableCount: newProduct.availableCount, // Send only the required fields
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the product list with the modified product
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === newProduct._id ? newProduct : product
          )
        );
        setEditingProduct(null); // Close the edit form
        setNewProduct({ name: '', description: '', price: 0, availableCount: 0 }); // Clear the form
        setError(null); // Clear any previous errors
      } else {
        setError(data.message || 'Error updating product');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  // Apply filtering, sorting, and searching
  const filteredProducts = products
    .filter((product) => {
      return (
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating_asc') {
        return a.ratings - b.ratings; // Sort by ratings ascending
      } else if (sortBy === 'rating_desc') {
        return b.ratings - a.ratings; // Sort by ratings descending
      }
      return 0;
    });

  // Handle product archive/unarchive
  const handleArchiveToggle = async (product) => {
    try {
      const response = await fetch(`/api/admin/${product.isArchived ? 'unarchive' : 'archive'}-product/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update the product's archived status
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === product._id ? { ...p, isArchived: !p.isArchived } : p
          )
        );
      } else {
        setError(data.message || 'Error updating archive status');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  if (loading) return <div>Loading...</div>; // Display loading message while fetching
  if (error) return <div>{error}</div>; // Display error message if there's an error

  return (
    <div>
      {/* Sort and Filter Section */}
      <div>
        <label>Sort by Ratings:</label>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="rating_desc">Highest to Lowest</option>
          <option value="rating_asc">Lowest to Highest</option>
        </select>
      </div>
      <div>
        <label>Filter by Price:</label>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Search by Name:</label>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add or Edit Product Form */}
      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>
        <div>
          <label>Availability:</label>
          <input
            type="number"
            name="availableCount"
            value={newProduct.availableCount}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
      </form>

      {/* Product List */}
      <div>
        {filteredProducts.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div>
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Available Count: {product.availableCount}</p>
                <p>Rating: {product.ratings}</p>
                <p>Status: {product.isArchived ? 'Archived' : 'Active'}</p>
                
                {/* Admin can edit/archive/unarchive any product */}
                <div>
                  <button onClick={() => handleEditProduct(product)}>Edit</button>
                  <button onClick={() => handleArchiveToggle(product)}>
                    {product.isArchived ? 'Unarchive' : 'Archive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
