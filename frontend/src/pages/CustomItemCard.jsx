import React from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ListingCard = (props) => {
  const { items, handleClickOpen, button } = props;
  const navigate = useNavigate();

  const handleRecentlyView = async (itemType, itemId) => {
    try {
      await axios.post(`https://valo-deal-backend.vercel.app/recentlyViewed/${itemType}/${itemId}`);
    } catch (e) {
      console.error(`Error viewing item:`, e);
    } finally {
      navigate(`/details/${itemType}/${itemId}`);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
      {items.map((item) => (
        <Grid item key={item._id} xs={12} sm={6} md={4}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              height: { xs: 'auto', sm: '260px' },
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                backgroundColor: 'grey.300',
              },
            }}
            onClick={() => handleRecentlyView(item.itemType, item._id)}
          >
            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '40%' }, height: { xs: '200px', sm: '100%' }, overflow: 'hidden' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '60%' }, padding: '12px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {item.brand} {item.model}
                </Typography>
                {item.condition && (
                  <Typography variant="body2" color="text.secondary">
                    Condition: {item.condition}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {item.authenticity ? `Authenticity: ${item.authenticity}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateText(item.description, 90)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#ff8300', fontWeight: 600 }}>
                  Price: ${item.price}
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
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListingCard;
