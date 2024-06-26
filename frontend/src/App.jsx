// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
import Navbar from './siteComponents/navbar';
import SecondNavbar from './siteComponents/second_navbar';
import Home from './pages/home';
import About from './pages/about';
import Pricing from './pages/pricing';
import Cart from './pages/cart';
import Sell from './pages/sell';
import MobileSellDetailsPage from './pages/mobileSellDetailsPage';

//tahsin
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";


const App = () => {
  

  return (
    <>
      <Navbar />
      <SecondNavbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/sell/mobile" element={<MobileSellDetailsPage />} />

          <Route path="/dashboard" element={<PrivateRoute />}>
            {/* <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} /> */}
            <Route path="" element={<Dashboard />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
