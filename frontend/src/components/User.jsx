import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const User = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch JWT token from local storage
        const storedToken = localStorage.getItem('token');
        if (!storedToken) throw new Error('Token not found');
        
        // Set token in state
        setToken(storedToken);

        // Make request with token in header to fetch user details
        const response = await axios.get(`http://localhost:3000/api/user/`, {
          headers: {
            Authorization: storedToken
          }
        });
        setUser(response.data);
        setFormData(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error fetching user data');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send PUT request with updated user data and token in header
      const response = await axios.put(`http://localhost:3000/api/user/`, formData, {
        headers: {
          Authorization: token // Send token with the request
        }
      });
      setUser(response.data);
      setFormData(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user data');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">User Details</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {editing ? (
          <form onSubmit={handleSubmit}>
            {/* Input fields */}
          </form>
        ) : (
          <div>
            {/* Display user details */}
          </div>
        )}
        <div className="text-center text-sm">
          <Link to="/" className="text-blue-400">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default User;
