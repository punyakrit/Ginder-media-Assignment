import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginimg from '../login.svg'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://login-7wzr.onrender.com/api/login', formData);
      const token = response.data.token;
  
      // Store the token in localStorage
      localStorage.setItem('token', token);
  
      // Set the default Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      alert("Login Success");
      navigate('/user');
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      {/* Left side with background image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center ml-20" 
      >
        <img src={loginimg}></img>
      </div>
      
      {/* Right side with login form */}
      <div className="lg:w-1/2 p-8">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign in to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-black"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" id="rememberMe" />
                <label htmlFor="rememberMe" className="text-gray-400">Remember me</label>
              </div>
            </div>
            <div className="flex items-center justify-center mb-6">
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Sign in
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="text-center text-sm">
              <span className="text-gray-400">Don't have an account?</span>
              <Link to="/signup" className="text-blue-400 ml-1">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
