import React, { useState, useEffect } from 'react';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(null); // Track which complaint is being edited
  const [updatedReply, setUpdatedReply] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Status filter (all, pending, resolved)
  const [sortOrder, setSortOrder] = useState('latest'); // Sorting order (latest or earliest)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('/api/admin/get-complaints', {
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
        setFilteredComplaints(data); // Initialize filtered complaints
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Error fetching complaints');
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    // First, sort complaints by date based on sortOrder
    const sortedComplaints = [...complaints].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      if (sortOrder === 'earliest') {
        return dateA - dateB; // Earliest to latest (ascending order)
      } else {
        return dateB - dateA; // Latest to earliest (descending order)
      }
    });

    // Then, filter complaints by status if needed
    let filtered = sortedComplaints;

    if (statusFilter !== 'all') {
      filtered = sortedComplaints.filter((complaint) => complaint.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, statusFilter, sortOrder]); // Run this effect whenever complaints, statusFilter, or sortOrder changes

  const handleStatusToggle = async (complaintId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';

    try {
      const response = await fetch(`/api/admin/update-complaint-status/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedComplaint = await response.json();
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, status: updatedComplaint.status } : complaint
        )
      );

      setSuccess('Complaint status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Error updating status');
    }
  };

  const handleReplyChange = (e) => {
    setUpdatedReply(e.target.value);
  };

  const handleReplySubmit = async (complaintId) => {
    try {
      const response = await fetch(`/api/admin/update-complaint-reply/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: updatedReply }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reply');
      }

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, reply: updatedReply } : complaint
        )
      );

      setUpdatedReply('');
      setIsEditing(null);
      setSuccess('Reply updated successfully');
    } catch (err) {
      console.error('Error updating reply:', err);
      setError('Error updating reply');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Complaints</h1>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {/* Status Filter */}
      <div style={styles.filterContainer}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.statusFilter}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Sort Order */}
      <div style={styles.filterContainer}>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.statusFilter}
        >
          <option value="latest">Latest to Earliest</option>
          <option value="earliest">Earliest to Latest</option>
        </select>
      </div>

      <div style={styles.complaintsContainer}>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <div key={complaint._id} style={styles.complaintCard}>
              <h3 style={styles.cardTitle}>{complaint.title}</h3>
              <p style={styles.cardBody}>{complaint.body}</p>
              <p>
                <strong>Status:</strong>{' '}
                <button
                  style={styles.statusButton}
                  onClick={() => handleStatusToggle(complaint._id, complaint.status)}
                >
                  {complaint.status}
                </button>
              </p>
              <p>
                <strong>Timestamp:</strong>{' '}
                {new Date(complaint.timestamp).toLocaleString()}
              </p>

              <div style={styles.replySection}>
                <strong>Reply:</strong>
                {isEditing === complaint._id ? (
                  <div>
                    <textarea
                      value={updatedReply}
                      onChange={handleReplyChange}
                      style={styles.replyInput}
                      placeholder="Type your reply here"
                    />
                    <button
                      onClick={() => handleReplySubmit(complaint._id)}
                      style={styles.replyButton}
                    >
                      Submit Reply
                    </button>
                  </div>
                ) : (
                  <p>{complaint.reply || 'No reply yet'}</p>
                )}
                <button
                  onClick={() => setIsEditing(isEditing === complaint._id ? null : complaint._id)}
                  style={styles.editButton}
                >
                  {isEditing === complaint._id ? 'Cancel Edit' : 'Edit Reply'}
                </button>
              </div>

              <div style={styles.userIdContainer}>
                <strong>Tourist ID:</strong> {complaint.tourist}
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noComplaints}>No complaints found</p>
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
  error: {
    color: 'red',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  statusFilter: {
    padding: '5px 10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
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
    position: 'relative',
  },
  cardTitle: {
    margin: '0 0 5px 0',
    color: '#555',
  },
  cardBody: {
    margin: '0 0 10px 0',
    color: '#666',
  },
  statusButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  replySection: {
    marginTop: '10px',
  },
  replyInput: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '80px',
    width: '100%',
  },
  replyButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  editButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#ffc107',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  userIdContainer: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    fontSize: '14px',
    color: '#555',
  },
  noComplaints: {
    textAlign: 'center',
    color: '#777',
  },
};

export default AdminComplaints;
