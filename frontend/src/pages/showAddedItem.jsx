import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, CircularProgress } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { formatDistanceToNow } from 'date-fns';
import phn1 from '/public/assets/images/phn1.jpg'
import phn2 from '/public/assets/images/phn2.jpg'
import phn3 from '/public/assets/images/phn3.jpg';
const AddedMobileList = () => {

  const images = [phn1, phn2, phn3];
  // Function to get a random image
  function getRandomImage() {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
  }
  // Get a random image
  const randomImage = getRandomImage();

  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMobiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://valo-deal-backend.vercel.app/api/v1/sell/mobiles');
      setMobiles(response.data.mobiles);
    } catch (err) {
      console.error('Error fetching mobiles:', err);
      setError('Failed to fetch mobile listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMobiles();
  }, []);

  const handleDelete = async (mobileId) => {
    try {
      await axios.delete(`https://valo-deal-backend.vercel.app/api/v1/sell/mobiles/${mobileId}`);
      fetchMobiles();
    } catch (err) {
      console.error('Error deleting mobile:', err);
      setError('Failed to delete mobile.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Mobile Listings
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {mobiles.map((mobile) => (
            <Grid item key={mobile._id} xs={12} sm={6} md={4}>
              <Card sx={{ width: '300px' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image={` ${mobile.images}`} //mobile.images[0]
                  alt={`${mobile.brand} ${mobile.model}`}
                  onError={(e) => (e.target.src = '/placeholder-image.jpg')} // Fallback image
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {mobile.brand} {mobile.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Condition: {mobile.condition}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Authenticity: {mobile.authenticity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${mobile.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {mobile.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDistanceToNow(new Date(mobile.createdAt), { addSuffix: true })}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small">View Details</Button>
                  <IconButton onClick={() => handleDelete(mobile._id)}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AddedMobileList;
