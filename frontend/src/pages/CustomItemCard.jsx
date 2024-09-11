import React from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ListingCard = (props) => {
  const { items, handleClickOpen, button } = props;
  const navigate = useNavigate();

  const handleRecentlyView = async (itemType, itemId) => {
    try {
      await axios.post(`http://localhost:8080/recentlyViewed/${itemType}/${itemId}`);
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
    <Grid container spacing={2} sx={{ flexWrap: 'wrap', gap: 0, ml: '20px' }}>
      {items.map((item) => (
        <Grid item key={item._id} xs={12} sm={6} md={4}>
          <Card sx={{ display: 'flex', flexDirection: 'row', height: '250px', borderRadius: '15px', overflow: 'hidden' }}>
            {/* Image on the left side */}
            <CardMedia
              component="img"
              sx={{ width: '40%', objectFit: 'cover' }}
              image={item.imgUrl[0]}
              alt={`${item.brand} ${item.model}`}
            />
            {/* Content on the right side */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%' }}>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
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
                  Price: ${item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {truncateText(item.description, 100)} {/* Truncate description */}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ backgroundColor: '#FF8C00', color: 'white' }}
                  onClick={() => handleRecentlyView(item.itemType, item._id)}
                >
                  View Details
                </Button>
                <IconButton onClick={() => handleClickOpen(item._id, item.itemType)}>
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
