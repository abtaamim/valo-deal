import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import './styles.css';

export default function Footer() {
  return (
    <footer className="footer">
      <Stack direction="row" spacing={4} className="footer-content hideOnMobile">
        <div>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            About Us
          </Typography>
          <Typography variant="body2">
            <Link to="/about">Our Story</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/careers">Careers</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/blog">Blog</Link>
          </Typography>
        </div>

        <div>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Support
          </Typography>
          <Typography variant="body2">
            <Link to="/contact">Contact Us</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/faq">FAQs</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/support">Help Center</Link>
          </Typography>
        </div>

        <div>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Legal
          </Typography>
          <Typography variant="body2">
            <Link to="/terms">Terms of Service</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/privacy">Privacy Policy</Link>
          </Typography>
          <Typography variant="body2">
            <Link to="/cookies">Cookie Policy</Link>
          </Typography>
        </div>

        <div>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Follow Us
          </Typography>
          <div>
            <IconButton component="a" href="https://www.facebook.com" target="_blank" aria-label="Facebook">
              <Facebook sx={{ color: 'rgb(2, 160, 242)', fontSize: 50 }} />
            </IconButton>
            <IconButton component="a" href="https://www.twitter.com" target="_blank" aria-label="Twitter">
              <Twitter sx={{ color: 'rgb(90, 20, 242)', fontSize: 50 }} />
            </IconButton>
            <IconButton component="a" href="https://www.instagram.com" target="_blank" aria-label="Instagram">
              <Instagram sx={{ color: 'rgb( 250,5,132)', fontSize: 50 }} />
            </IconButton>
            <IconButton component="a" href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
              <LinkedIn sx={{ color: 'rgb(24, 60, 242)', fontSize: 50 }} />
            </IconButton>
          </div>
        </div>
      </Stack>

      <div className="footer-bottom">
        <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Valo Deal. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgb(194, 228, 255)', textAlign: 'center', marginTop: '8px' }}>
          Contact us: info@valodeal.com | +8801736177788
        </Typography>
      </div>
    </footer>
  );
}
