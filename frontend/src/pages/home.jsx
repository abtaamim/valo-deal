import React from 'react';
import { useAuth } from '../context/auth';

const HomePage = () => {
  const [auth, setAuth] = useAuth();

  return (
    <div title={"Best Offers"} style={{ padding: '20px', textAlign: 'center' }}>
      <h1>HomePage</h1>
      {auth.user ? (
        <h2 style={{ color: '#007bff', fontWeight: 'bold' }}>Welcome back, {auth.user.name}!</h2>
      ) : (
        <h2 style={{ color: '#555' }}>Please sign in to see the best offers.</h2>
      )}
    </div>
  );
};


export default HomePage;
