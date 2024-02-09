import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx'; // Assuming App.jsx is your main application component
import './index.css';

// Function to ping the backend periodically
function pingBackend() {
  setInterval(() => {
    fetch('/api/ping')
      .then(response => {
        if (!response.ok) {
          console.error('Error pinging backend:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error pinging backend:', error.message);
      });
  }, 20000); // Ping every 60 seconds (adjust as needed)
}

// Call the function to start pinging the backend
pingBackend();

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);
