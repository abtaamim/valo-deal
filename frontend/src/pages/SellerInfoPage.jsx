import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const SellerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, phone, address, email } = location.state || {};

  return (
    <Box
      sx={{
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#1f1f1f',
        maxWidth: '600px',
        margin: '20px auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: '1.6rem',
          color: '#fff',
          marginBottom: '15px',
          textAlign: 'center',
          letterSpacing: '0.5px',
        }}
      >
        Seller Info
      </Typography>
      <Typography
        sx={{
          fontSize: '1.1rem',
          color: '#e0e0e0',
          marginTop: '10px',
          '& span': {
            fontWeight: 'bold',
            color: '#ffa500',
          },
        }}
      >
        <span>Name:</span> {name}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.1rem',
          color: '#e0e0e0',
          marginTop: '10px',
          '& span': {
            fontWeight: 'bold',
            color: '#ffa500',
          },
        }}
      >
        <span>Phone:</span> {phone}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.1rem',
          color: '#e0e0e0',
          marginTop: '10px',
          '& span': {
            fontWeight: 'bold',
            color: '#ffa500',
          },
        }}
      >
        <span>Address:</span> {address}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.1rem',
          color: '#e0e0e0',
          marginTop: '10px',
          '& span': {
            fontWeight: 'bold',
            color: '#ffa500',
          },
        }}
      >
        <span>Email:</span> {email}
      </Typography>
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ backgroundColor: '#09c231', '&:hover': { backgroundColor: '#096a1e' } }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default SellerInfo;
