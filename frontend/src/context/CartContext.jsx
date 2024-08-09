
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartSize, setCartSize] = useState(0);

  const updateCartSize = async () => {
    try {
      const response = await axios.get('http://localhost:8080/cart/size');
      setCartSize(response.data.cartSize);
    } catch (error) {
      console.error('Error fetching cart size:', error);
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
