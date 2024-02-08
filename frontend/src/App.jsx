import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import User from './components/User';
import Login from './components/Login';
import Register from './components/Register';
import Error from './components/Error';

function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/user" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
