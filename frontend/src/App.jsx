// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
import Navbar from './siteComponents/navbar';
import SecondNavbar from './siteComponents/second_navbar';
import HomePage from './pages/home';
import About from './pages/about';
import Pricing from './pages/pricing';
import Cart from './pages/cart';
import Sell from './pages/sell';
import MobileSellDetailsPage from './pages/mobileSellDetailsPage';
import MobileAccessoriesSellDetailsPage from './pages/mobileAccessoriesSellDetails';
import AddedItemList from './pages/showAddedItem';
import RecentlyViewedItemPage from './pages/recentlyViewedItem';
import AddedMobileList from './pages/showAddedItem';
//import ComputerSellPage from './pages/computerSell';

import { ComputerSellPage, VehicleSellPage, ElectronicsSellPage } from './pages/sellDetailsPage';
import { CartProvider } from './context/CartContext';
import ShowSubCatItem from './pages/showSubCatItem';

//tahsin
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { PostDetails } from './siteComponents/PostDetails';

const App = () => {
  

  return (
    <>
      <CartProvider>
      <Navbar />
      <SecondNavbar />
      <div className="container">
        <Routes>
          {/* <Route path="/" element={()=> <Navigate to='/posts' /> } />
          <Route path="/posts" element={<Home />} />
          <Route path="/posts/search" element={<Home />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/sell/mobile" element={<MobileSellDetailsPage />} />
          <Route path="/sell/mobile-accessories" element={<MobileAccessoriesSellDetailsPage />} />
          <Route path="/sell/computers" element={< ComputerSellPage/>} />
          <Route path="/sell/vehicles" element={< VehicleSellPage/>} />
          <Route path="/sell/electronics" element={< ElectronicsSellPage/>} />
          <Route path="/sub-category-item/:category/:subCat" element={<ShowSubCatItem/>} />
          <Route path="/added-items" element={<AddedItemList/>}/>
          <Route path="/recently-viewed" element={<RecentlyViewedItemPage/>} />

          <Route path="/dashboard" element={<PrivateRoute />}>
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
      </CartProvider>
    </>
  );
};

export default App;
