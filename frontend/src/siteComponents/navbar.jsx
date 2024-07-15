import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { IconButton, Tooltip, Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SignInPopover from './signin_popover';
import logo from '/public/assets/images/logo1.png';
import SearchBar from './searchbar';
import CustomLink from './CustomLink';
import './styles.css';

export default function Navbar({ onSearch }) {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <div style={{ width: '30px' }}>
          <img src={logo} alt="Logo" style={{ width: '100%' }} />
        </div>
      </Link>
      <div className="hideOnMobile">
        <Typography variant="body1" sx={{ paddingLeft: "22px" }}>
          Deliver to <br />
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center' }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 'large' }} />
          Khilgaon
        </Typography>
      </div>
      <SearchBar onSearch={onSearch} />
      <ul>
        <div className="hideOnMobile navhover">
          <CustomLink to="/pricing">Pricing</CustomLink>
        </div>
        <div className="hideOnMobile navhover">
          <CustomLink to="/about">About</CustomLink>
        </div>
        <CustomLink to="/cart" id="cart" className="hideOnMobile">
          {({ isActive }) => (
            <Tooltip title="Cart">
              <IconButton size="large" className={`cart-icon ${isActive ? 'active' : ''}`}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </CustomLink>
        <SignInPopover className="hideOnMobile" />
      </ul>
    </nav>
  );
}
