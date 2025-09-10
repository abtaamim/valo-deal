import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Box, IconButton, CircularProgress, Badge } from '@mui/material';
import { useNavigate, } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { color } from 'framer-motion';
const ListingCard = ({ items, handleClickOpen, button, offer_per = 0, my_added = false }) => {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const handleRecentlyView = async ( itemId) => {
    setLoading(itemId); // Start loading when item is clicked
    try {
      // await axiosPrivate.post(/recentlyViewed/${itemType}/${itemId}); 
    } 
    catch (e) {
      console.error("Error viewing item:", e);
    }
    finally {
      setLoading(null);
      // console.log("path", location.pathname)
      navigate(`/details/${ itemId }`, { state: { prevUrl: location.pathname } });
    }
  };
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');

  return (
    <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
      {items?.map((item) => {
        const discountedPrice = offer_per > 0
          ? item.price - (item.price * offer_per) / 100
          : item.price;

        return (
          <Grid item key={item._id} xs={12} sm={6} lg={4} xl={3}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
                position: 'relative',
              }}
              onClick={() => handleRecentlyView( item._id)}
            >
              {/* Image Section */}
              <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                <CardMedia
                  component="img"
                  image={item.img_urls[0]}
                  alt={`${item.brand} ${item.model}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    View Details
                  </Typography>
                </Box>
              </Box>

              {/* Content Section */}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {my_added == true ? (
                  <Typography variant="h8" component="div">
                    Product Status: {item.product_status=='stock_out'?'Out of Stock':item.product_status}
                    </Typography>
                ):null

                }
                <Typography variant="h6" component="div">
                  {item.brand} {item.model}
                </Typography>

                {item.condition && (
                  <Typography variant="body2" color="text.secondary">
                    Condition:{' '}
                    <Box component="span" sx={{ color: item.condition === 'new' ? 'green' : 'red', fontWeight: 600 }}>
                      {item.condition}
                    </Box>
                  </Typography>
                )}

                {item.authenticity && (
                  <Typography variant="body2" color="text.secondary">
                    Authenticity: <Box component="span" sx={{ color: 'black' }}>{item.authenticity}</Box>
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{
                    color: 'navy',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.product_description}
                </Typography>
              </CardContent>

              {/* Actions / Price */}
              <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {offer_per > 0 && (
                    <Typography variant="body2" sx={{ color: '#888', textDecoration: 'line-through' }}>
                      {formatPrice(item.price)}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ color: '#ff8300', fontWeight: 600 }}>
                    {formatPrice(discountedPrice)}
                  </Typography>
                  {offer_per > 0 && (
                    <Badge

                      badgeContent={`${offer_per}% OFF`}
                      color="error"
                      sx={{
                        ml: 2,
                        '& .MuiBadge-badge': {
                          fontSize: '0.5rem',
                          height: 44,
                          minWidth: 34,
                          padding: '0 6px',
                          borderRadius: '12px',
                        },
                      }}
                    />
                  )}
                </Box>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickOpen(item._id);
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.200' },
                    p: 1,
                    boxShadow: 1,
                    borderRadius: '50%',
                  }}
                >
                  {button}
                </IconButton>
              </CardActions>

              {/* Loading Spinner */}
              {loading === item._id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.6)',
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
        );
      })}
    </Grid>
  );
};

export default ListingCard;
