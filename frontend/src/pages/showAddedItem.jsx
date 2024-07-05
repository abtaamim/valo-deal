import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { formatDistanceToNow } from 'date-fns';
const AddedMobileList = () => {
  const [mobiles, setMobiles] = useState([]);

  // Define fetchMobiles outside of useEffect for reusability
  const fetchMobiles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/sell/mobiles');
      setMobiles(response.data.mobiles);
    } catch (error) {
      console.error('Error fetching mobiles:', error);
    }
  };

  useEffect(() => {
    fetchMobiles(); // Fetch mobiles on initial render
  }, []); // Empty dependency array means it runs only once after mount

  const handleDelete = async (mobileId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/sell/mobiles/${mobileId}`);
      fetchMobiles(); // Fetch mobiles again after successful deletion
    } catch (error) {
      console.error('Error deleting mobile:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Mobile Listings
      </Typography>
      <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {mobiles.map((mobile) => (
          <Grid item key={mobile._id} xs={12} sm={6} md={4}>
            <Card sx={{width:'300px'}}>
              <CardMedia
                component="img"
                height="240"
                image={`http://localhost:8080${mobile.images[0]}`}
                alt={`${mobile.brand} ${mobile.model}`}
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
                  {formatDistanceToNow(new Date(mobile.createdAt) ,{addSuffix:true})}
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
    </Box>
  );
};

export default AddedMobileList;
