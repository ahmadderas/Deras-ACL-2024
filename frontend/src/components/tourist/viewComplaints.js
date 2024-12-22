import React, { useState, useEffect } from 'react';

const TouristComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // Toggle complaint form
  const [newComplaint, setNewComplaint] = useState({ title: '', body: '' }); // New complaint data
  const [success, setSuccess] = useState('');
  const userId = localStorage.getItem('userId'); // Get the userId from local storage

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`/api/tourist/get-complaints/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }

        const data = await response.json();
        setComplaints(data); // Update state with complaints
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Error fetching complaints'); // Only show this if fetch fails
      }
    };

    fetchComplaints();
  }, [userId]);

  const handleFormToggle = () => {
    setShowForm(!showForm); // Toggle form visibility
    setSuccess(''); // Clear previous success messages
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/tourist/file-complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newComplaint, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to file complaint');
      }

      const data = await response.json();
      setComplaints((prev) => [...prev, data]); // Add new complaint to the list
      setNewComplaint({ title: '', body: '' }); // Clear form
      setShowForm(false); // Hide form
      setSuccess('Complaint filed successfully');
    } catch (err) {
      console.error('Error filing complaint:', err);
      setError('Error filing complaint');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Complaints</h1>
      {success && <p style={styles.success}>{success}</p>}
      <button style={styles.fileComplaintButton} onClick={handleFormToggle}>
        {showForm ? 'Cancel' : 'File a Complaint'}
      </button>

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmitComplaint}>
          <input
            type="text"
            name="title"
            value={newComplaint.title}
            placeholder="Complaint Title"
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <textarea
            name="body"
            value={newComplaint.body}
            placeholder="Complaint Body"
            onChange={handleInputChange}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.submitButton}>
            Submit Complaint
          </button>
        </form>
      )}

      <div style={styles.complaintsContainer}>
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div key={complaint._id} style={styles.complaintCard}>
              <h3 style={styles.cardTitle}>{complaint.title}</h3>
              <p style={styles.cardBody}>{complaint.body}</p>
              <p>
                <strong>Status:</strong> {complaint.status}
              </p>
              <p>
                <strong>Timestamp:</strong>{' '}
                {new Date(complaint.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Reply:</strong> {complaint.reply}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noComplaints}>{error ? error : 'No complaints found'}</p> // Show error only if there was an issue
        )}
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  success: {
    color: 'green',
    textAlign: 'center',
  },
  fileComplaintButton: {
    display: 'block',
    margin: '20px auto',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '20px auto',
    maxWidth: '400px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '80px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  complaintsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  complaintCard: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    margin: '0 0 5px 0',
    color: '#555',
  },
  cardBody: {
    margin: '0 0 10px 0',
    color: '#666',
  },
  noComplaints: {
    textAlign: 'center',
    color: '#777',
  },
};

export default TouristComplaints;
