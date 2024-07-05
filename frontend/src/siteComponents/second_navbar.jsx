import React from 'react';
import { useNavigate } from 'react-router-dom';
import AllDrawer from './all_sidebar';
import CustomLink from './CustomLink';
import { useAuth } from '../context/auth';

export default function SecondNavbar() {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <nav className="secondNav">
      <ul>
        <AllDrawer />
        {auth.user ? (
          <CustomLink to="/sell">Sell</CustomLink>
        ) : (
          <CustomLink to="/login" >Sell</CustomLink>
        )}
        <li></li>
      </ul>
    </nav>
  );
}
