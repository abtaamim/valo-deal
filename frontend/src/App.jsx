// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
import { useAuth } from './contexts/AuthContext';
import Navbar from './siteComponents/navbar';
import SecondNavbar from './siteComponents/second_navbar';
import Home from './pages/home';
import About from './pages/about';
import Pricing from './pages/pricing';
import Cart from './pages/cart';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './pages/Dashboard';
import Sell from './pages/sell';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <SecondNavbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/signup" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signin" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
