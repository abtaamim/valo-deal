import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Badge, IconButton, Stack, Tooltip } from '@mui/material';
import SignInPopover from './signin_popover';
import logo from '/public/assets/images/logo1.png'
import SearchBar from './searchbar';
import {Typography} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import './styles.css';
import CustomLink from './CustomLink';

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
      <div style={{ width: '30px'}}>
        <img src={logo} alt="Logo" style={{ width: '100%' }}  />
        </div>
      </Link>
        <div className='hideOnMobile' >
        <Typography variant='h10' sx={{paddingLeft:"22px"}}>
            Deliver to <br />
          </Typography>
          <Typography variant='h7'  sx={{fontWeight:'bold' ,color:'white', display: 'flex', alignItems: 'center'}}>
          <LocationOnOutlinedIcon sx={{ fontSize: 'big' }} />
            Khilgaon
          </Typography>  
          </div>
      <SearchBar/>

      <ul >
      
        <div className="hideOnMobile navhover"> <CustomLink to="/pricing" >Pricing</CustomLink>
        </div>
        
        <div className="hideOnMobile navhover">  <CustomLink to="/about" >About</CustomLink>
        </div>
        <CustomLink to="/cart" id='cart' className='hideOnMobile'>
          {({ isActive }) => (
            <Tooltip title="Cart">
              <IconButton size='large' className={`cart-icon ${isActive ? 'active' : ''}`}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </CustomLink>
        
          <SignInPopover className='hideOnMobile'/>
        
      </ul>
    </nav>
  );
}

