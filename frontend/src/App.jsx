
import Navbar from "./siteComponents/navbar"
import Home from "./pages/home"
import About from "./pages/about"
import Pricing from "./pages/pricing"
import { Route, Routes } from "react-router-dom"
import Cart from "./pages/cart"
import SignIn from "./pages/signin"
import SecondNavbar from "./siteComponents/second_navbar"
import Sell from "./pages/sell"
import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './contexts/AuthContext';




const App = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <>
        <Navbar />
        <SecondNavbar />
        <div className="container">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/sell" element={<Sell />} />
            {/* signin signup */}
            <Route path="/" element={!isAuthenticated ? <Register /> : <Navigate to='/dashboard' />} />
            <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={isAuthenticated ? <Dashboard /> : <Login />} />
          </Routes>

        </div>
      </>
    </Router>
  );
};


export default App