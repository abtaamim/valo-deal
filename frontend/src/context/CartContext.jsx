
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from './auth';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartSize, setCartSize] = useState(0);
  const [auth] = useAuth();
  const updateCartSize = async () => {
    if (auth.user !== null) {
      try {
        const response = await axios.get('https://valo-deal-backend.vercel.app/cart/size');
        setCartSize(response.data.cartSize);
      } catch (error) {
        console.error('Error fetching cart size:', error);
      }
    }
    else {
      setCartSize(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartSize, updateCartSize }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use the Cart Context
export const useCart = () => {
  return useContext(CartContext);
};
