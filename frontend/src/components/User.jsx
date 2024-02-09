import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../imgs.png'

const UserDisplay = ({ user }) => (
  <div className="rounded-md p-6 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-md border border-gray-600">
    <div className="flex flex-col items-center space-y-4">
      <img src={img} alt="Profile" className="rounded-full h-24 w-24 border-4 border-white" />
      {user.name ? (
        <div className="space-y-4 text-center">
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Name:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">Phone:</span>
            <span>{user.phone}</span>
          </div>
        </div>
      ) : (
        <p className="text-red-600 font-semibold">Login First</p>
      )}
    </div>
  </div>
);


const UserEdit = ({ formData, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Name"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white bg-gray-700 focus:bg-gray-800 placeholder-gray-500"
      />
    </div>
    <div className="mb-4">
      <input
        id="phone"
        name="phone"
        type="text"
        autoComplete="phone"
        required
        value={formData.phone || ''}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white bg-gray-700 focus:bg-gray-800 placeholder-gray-500"
      />
    </div>
    <div className="flex items-center justify-center mb-6">
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Save
      </button>
    </div>
  </form>
);


const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://login-7wzr.onrender.com/api/user/`);
        setUser(response.data);
        setFormData({ ...response.data });
        setError('');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('User not found');
        } else {
          setError('Error fetching user data');
        }
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://login-7wzr.onrender.com/api/user/`, formData);
      setUser(response.data);
      setFormData({ ...response.data });
      setEditing(false);

      const updatedResponse = await axios.get(`https://login-7wzr.onrender.com/api/user/`);
      setUser(updatedResponse.data);
      setFormData({ ...updatedResponse.data });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error updating user data');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-md p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">User Details</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {editing ? (
          <UserEdit formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
        ) : (
          <UserDisplay user={user} />
        )}
        <div className="flex items-center justify-center my-6">
          {!editing && (
            <>
              <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Edit
              </button>
              {localStorage.getItem('token') ? (
                <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline">
                  Sign Out
                </button>
              ) : (
                <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline">
                  Login First
                </Link>
              )}
            </>
          )}
        </div>
        <div className="text-center text-sm">
          <Link to="/" className="text-blue-400">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default User;
