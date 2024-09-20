import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { useNavigate, } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { color } from 'framer-motion';

const ListingCard = (props) => {
  const { items, handleClickOpen, button } = props;
  const [loading, setLoading] = useState(null); // State to track loading for each item
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const handleRecentlyView = async (itemType, itemId) => {
    setLoading(itemId); // Start loading when item is clicked
    try {
      await axiosPrivate.post(`/recentlyViewed/${itemType}/${itemId}`);
    } catch (e) {
      console.error(`Error viewing item:`, e);
    } finally {
      setLoading(null);
      console.log("path", location.pathname)
      navigate(`/details/${itemType}/${itemId}`, { state: { prevUrl: location.pathname } });
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  return (
    <Grid container spacing={10} sx={{ justifyContent: 'flex-start' }}>
      {items.map((item) => (
        <Grid item key={item._id} xs={12} sm={6} lg={4} xl={3}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              height: { xs: 'auto', sm: '260px' },
              width: { lg: '360px' },
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, backgroundColor 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                backgroundColor: 'grey.300',
              },
              position: 'relative', // For loading overlay
            }}
            onClick={() => handleRecentlyView(item.itemType, item._id)}
          >
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '40%', lg: '50%' }, height: { xs: '200px', sm: '100%' }, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                image={item.imgUrl[0]}
                alt={`${item.brand} ${item.model}`}
              />
              <Box
                className="view-details-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <Typography variant="h6">View Details</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', height: '100%', alignSelf: 'self-start', flexDirection: 'column', width: { xs: '100%', sm: '60%' }, padding: '2px' }}>
              <CardContent sx={{ flexGrow: 1, alignItems: 'flex-start' }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'left' }} >
                  {item.brand} {item.model}
                </Typography>
                {item.condition && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                    Condition:{' '}
                    <Box component="span" sx={{ color: item.condition === 'new' ? 'green' : 'red', fontWeight: 'bold' }}>
                      {item.condition}
                    </Box>
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                  {item.authenticity ? (<>Authenticity: {' '}
                    <Box component="span" sx={{ color: 'black' }}>
                      {item.authenticity}
                    </Box> </>)
                    : ''}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left',
                    color: 'navy',
                  }}
                >
                  {item.description}
                </Typography>
              </CardContent>

              <Box sx={{}}>
                <CardActions sx={{ justifyContent: 'space-between', }}>
                  <Typography variant="body2" sx={{ color: '#ff8300', fontWeight: 600 }}>
                    Price: {formatPrice(item.price)}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(item._id, item.itemType);
                    }}
                    sx={{

                      color: 'inherit',
                      '& .MuiSvgIcon-root': {
                        color: 'inherit',
                      },
                    }}
                  >
                    {button}
                  </IconButton>
                </CardActions>
              </Box>
            </Box>

            {/* Loading Spinner Overlay */}
            {loading === item._id && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListingCard;
