import React from 'react';
import { useAuth } from '../context/auth';

const HomePage = () => {
  const [auth, setAuth] = useAuth();

  return (
    <div title={"Best Offers"} style={{ padding: '20px', textAlign: 'center' }}>
      <h1></h1>
      {auth.user ? (
        <h2 style={{ color: '#007bff', fontWeight: 'bold' }}>Welcome back, {auth.user.name}!</h2>
      ) : (
        <h2 style={{ color: '#7bff00' }}>Sign in to unlock the best deals.</h2>
      )}
    </div>
  );
};


export default HomePage;
