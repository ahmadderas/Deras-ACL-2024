import React, { useState, useEffect } from 'react';

const ActivityCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState({ id: '', name: '' });
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to track any error

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Reset any previous errors
    try {
      const response = await fetch('/api/admin/activity-categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categories = await response.json();
      console.log('Fetched categories:', categories.name); // Log the fetched data
      setCategories(categories); // Assuming 'data.categories' is the correct path
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }
    try {
      const response = await fetch('/api/admin/activity-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory })
      });
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      fetchCategories(); // Refresh the list of categories
      setNewCategory(''); // Clear the input field
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category'); // Set error message
    }
  };

  // Update a category
  const handleUpdateCategory = async () => {
    if (!editCategory.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    try {
      const response = await fetch(`/api/admin/activity-categories/${editCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCategory.name })
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      fetchCategories(); // Refresh the list of categories
      setEditCategory({ id: '', name: '' }); // Clear the edit form
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category'); // Set error message
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/admin/activity-categories/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      fetchCategories(); // Refresh the list of categories
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category'); // Set error message
    }
  };

  return (
    <div>
      <h2>Activity Categories</h2>

      {/* Display loading message while fetching */}
      {loading && <p>Loading categories...</p>}

      {/* Display error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* List of categories */}
      <ul>
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <li key={category._id}>
              {category.name}
              <button onClick={() => setEditCategory({ id: category._id, name: category.name })}>Edit</button>
              <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </ul>

      {/* Add New Category */}
      <h3>Add New Category</h3>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={handleAddCategory}>Add Category</button>

      {/* Edit Category Form */}
      {editCategory.id && (
        <div>
          <h3>Edit Category</h3>
          <input
            type="text"
            value={editCategory.name}
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
          />
          <button onClick={handleUpdateCategory}>Save</button>
        </div>
      )}
    </div>
  );
};

export default ActivityCategories;
