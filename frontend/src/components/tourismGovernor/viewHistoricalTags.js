import React, { useState, useEffect } from 'react';

const HistoricalTagComponent = () => {
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);

  // Fetch all tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tourismGovernor/historical-tags');
        if (!response.ok) throw new Error('Error fetching tags');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form to create or update a tag
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? 'PATCH' : 'POST';
    const url = editMode
      ? `/api/tourismGovernor/historical-tags/${editingTagId}`
      : '/api/tourismGovernor/historical-tags';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error submitting tag data');
      const updatedTag = await response.json();

      if (editMode) {
        setTags(tags.map((tag) => (tag._id === editingTagId ? updatedTag : tag)));
      } else {
        setTags([...tags, updatedTag]);
      }

      setFormData({
        name: '',
      });
      setEditMode(false);
      setEditingTagId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Edit a tag
  const handleEdit = (tag) => {
    setFormData({
      name: tag.name,
    });
    setEditMode(true);
    setEditingTagId(tag._id);
  };

  // Delete a tag
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tourismGovernor/historical-tags/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting tag');
      setTags(tags.filter((tag) => tag._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Historical Tag Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Historical Tag Name"
          required
        />
        <button type="submit">{editMode ? 'Update' : 'Create'} Tag</button>
      </form>

      <ul>
        {tags.map((tag) => (
          <li key={tag._id}>
            <h3>{tag.name}</h3>
            <button onClick={() => handleEdit(tag)}>Edit</button>
            <button onClick={() => handleDelete(tag._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoricalTagComponent;
