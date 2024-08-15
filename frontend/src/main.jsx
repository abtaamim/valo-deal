// index.jsx or main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/auth';
import './index.css';
import './siteComponents/styles.css';
import reportWebVitals from './reportWebVitals';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals(); //tahsin