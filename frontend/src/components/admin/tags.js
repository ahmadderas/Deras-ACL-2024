import React, { useState, useEffect } from 'react';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [editTag, setEditTag] = useState({ id: '', name: '' });
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to track any error

  // Fetch all tags
  const fetchTags = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Reset any previous errors
    try {
      const response = await fetch('/api/admin/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const tags = await response.json();
      console.log('Fetched tags:', tags.name); // Log the fetched data
      setTags(tags); // Assuming 'data.tags' is the correct path
    } catch (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags'); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Add a new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) {
      alert('Please enter a tag name');
      return;
    }
    try {
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag })
      });
      if (!response.ok) {
        throw new Error('Failed to add tag');
      }
      fetchTags(); // Refresh the list of tags
      setNewTag(''); // Clear the input field
    } catch (error) {
      console.error('Error adding tag:', error);
      setError('Failed to add tag'); // Set error message
    }
  };

  // Update a tag
  const handleUpdateTag = async () => {
    if (!editTag.name.trim()) {
      alert('Please enter a tag name');
      return;
    }
    try {
      const response = await fetch(`/api/admin/tags/${editTag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editTag.name })
      });
      if (!response.ok) {
        throw new Error('Failed to update tag');
      }
      fetchTags(); // Refresh the list of tags
      setEditTag({ id: '', name: '' }); // Clear the edit form
    } catch (error) {
      console.error('Error updating tag:', error);
      setError('Failed to update tag'); // Set error message
    }
  };

  // Delete a tag
  const handleDeleteTag = async (id) => {
    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }
      fetchTags(); // Refresh the list of tags
    } catch (error) {
      console.error('Error deleting tag:', error);
      setError('Failed to delete tag'); // Set error message
    }
  };

  return (
    <div>
      <h2>Tag Categories</h2>

      {/* Display loading message while fetching */}
      {loading && <p>Loading tags...</p>}

      {/* Display error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* List of tags */}
      <ul>
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag._id}>
              {tag.name}
              <button onClick={() => setEditTag({ id: tag._id, name: tag.name })}>Edit</button>
              <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No tags available</p>
        )}
      </ul>

      {/* Add New Tag */}
      <h3>Add New Tag</h3>
      <input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />
      <button onClick={handleAddTag}>Add Tag</button>

      {/* Edit Tag Form */}
      {editTag.id && (
        <div>
          <h3>Edit Tag</h3>
          <input
            type="text"
            value={editTag.name}
            onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
          />
          <button onClick={handleUpdateTag}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Tags;
