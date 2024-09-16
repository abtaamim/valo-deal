// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
import Navbar from './siteComponents/navbar';
import SecondNavbar from './siteComponents/second_navbar';
import Footer from './siteComponents/Footer';
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
import SearchPage from './pages/SearchPage';
import ShowDetailsPage from './pages/ShowDetails';
import PreviousOrders from './pages/PreviousOrdersPage';
import SellerInfo from './pages/SellerInfoPage';
//import ComputerSellPage from './pages/computerSell';

import { ComputerSellPage, VehicleSellPage, ElectronicsSellPage } from './pages/sellDetailsPage';
import { CartProvider } from './context/CartContext';
import ShowSubCatItem from './pages/showSubCatItem';
import Profile from './pages/myAccountPage';
import PaymentPage from './pages/PaymentPage';
import PaymentForSingleBuy from './pages/PaymentForSingleBuy';
import SingleItemPaymentPage from "./pages/SingleItemPaymentPage";
import PersistLogin from './components/PersistLogin';
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
import { Toaster } from 'react-hot-toast';

const App = () => {


  return (
    <>
      {/* <CartProvider> */}
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

          <Route element={<PersistLogin />} >
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/single-item-payment" element={<SingleItemPaymentPage />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/sell-mobile" element={<MobileSellDetailsPage />} />
            <Route path="/sell/mobile-accessories" element={<MobileAccessoriesSellDetailsPage />} />
            <Route path="/sell/computers" element={< ComputerSellPage />} />
            <Route path="/sell/vehicles" element={< VehicleSellPage />} />
            <Route path="/sell/electronics" element={< ElectronicsSellPage />} />
            <Route path="/sub-category-item/:category/:subCat" element={<ShowSubCatItem />} />
            <Route path="/added-items" element={<AddedItemList />} />
            <Route path="/recently-viewed" element={<RecentlyViewedItemPage />} />
            <Route path='/previous-orders' element={<PreviousOrders />} />
          </Route>

          <Route path="/search/:keyword" element={<SearchPage />} />
          <Route path='/details/:itemType/:itemId' element={<ShowDetailsPage />} />
          <Route path="/seller-info" element={<SellerInfo />} />
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
      <Footer />
      {/* </CartProvider> */}
      <Toaster />
    </>
  );
};

export default App;