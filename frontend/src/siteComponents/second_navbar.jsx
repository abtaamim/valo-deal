import React from 'react';
import { useNavigate } from 'react-router-dom';
import AllDrawer from './all_sidebar';
import CustomLink from './CustomLink';
import { useAuth } from '../context/auth';
import SignInPopover from './signin_popover';

import { useMediaQuery } from '@mui/material';
export default function SecondNavbar() {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  const isXs = useMediaQuery('(max-width:450px)');
  return (
    <nav className="secondNav">
      {/* <ul> */}
      <div className="leftSide">
        <AllDrawer />
        {auth.user ? (
          <CustomLink to="/sell">Sell</CustomLink>
        ) : (
          <CustomLink to="/login" >Sell</CustomLink>
        )}
      </div>
      {isXs && (
        <div className="signInPopoverWrapper">
          <SignInPopover />
        </div>
      )}
      {/* </ul> */}
    </nav>
  );
}
