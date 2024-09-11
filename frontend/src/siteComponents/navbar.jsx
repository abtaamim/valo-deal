import React, { useEffect, useState } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SellIcon from '@mui/icons-material/Sell';
import { Badge, IconButton, Stack, Tooltip } from '@mui/material';
import SignInPopover from './signin_popover';
import logo from '/public/assets/images/logo1.png'
import SearchBar from './searchbar';
import { Typography, useMediaQuery } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import './styles.css';
import CustomLink from './CustomLink';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/auth';
export default function Navbar() {
  const [auth] = useAuth();
  const { cartSize } = useCart();
  const isXs = useMediaQuery('(max-width:450px)');
  const divStyle = {
    width: '30px',
    marginLeft: isXs ? '35px' : '0px'
  };
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <div style={divStyle}>
          <img src={logo} alt="Logo" style={{ width: '100%' }} />
        </div>
      </Link>
      <div className='hideOnMobile'>
        <Stack direction="column" sx={{ pl: 2, color: 'white' }} >
          <Typography variant="subtitle2" sx={{ lineHeight: '1', mb: 0.5, color: 'rgb(194, 228, 255)' }}>
            Deliver to
          </Typography>
          <Typography
            //variant="caption"
            sx={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            <LocationOnOutlinedIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />

            {auth.user ? `${auth.user.address}` : null}
          </Typography>
        </Stack>
      </div>
      <SearchBar />

      <ul >
        {!isXs ? (auth.user ?
          (<CustomLink to="/added-items" className='hideOnMobile'>
            {({ isActive }) => (
              <Tooltip title="added items for sell">
                <IconButton size='large' className={`cart-icon ${isActive ? 'active' : ''}`}>
                  <SellIcon />
                </IconButton>
              </Tooltip>
            )}
          </CustomLink>) : (
            <CustomLink to="/login" >
              {({ isActive }) => (
                <Tooltip title="added items for sell">
                  <IconButton size='large' className={`cart-icon ${isActive ? 'active' : ''}`}>
                    <SellIcon />
                  </IconButton>
                </Tooltip>
              )}
            </CustomLink>
          )) : null
        }
        {!isXs ? (auth.user ?
          (<CustomLink to="/cart" id='cart' className='hideOnMobile'>
            {({ isActive }) => (
              <Tooltip title="Cart">
                <Badge badgeContent={cartSize} color="secondary" overlap='circular'>
                  <IconButton size='large' className={`cart-icon ${isActive ? 'active' : ''}`}>
                    <ShoppingCartOutlinedIcon />
                  </IconButton></Badge>
              </Tooltip>
            )}
          </CustomLink>) : (
            <CustomLink to="/login" >
              {({ isActive }) => (
                <Tooltip title="Cart">
                  <Badge badgeContent={cartSize} color="secondary" overlap='circular'>
                    <IconButton size='large' className={`cart-icon ${isActive ? 'active' : ''}`}>
                      <ShoppingCartOutlinedIcon />
                    </IconButton></Badge>
                </Tooltip>
              )}
            </CustomLink>
          )) : null
        }
        {!isXs ? <SignInPopover /> : null}


      </ul>
    </nav>
  );
}
