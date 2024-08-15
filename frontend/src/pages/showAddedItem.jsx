import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { formatDistanceToNow } from 'date-fns';

const ListingCard = ({ item, onDelete }) => {
  const imageUrls = item.imgUrl
  console.log(typeof item.imgUrl);
  console.log("000",typeof imageUrls[0]);
  console.log("next>>>",imageUrls);
  console.log("after>>>",imageUrls[0]);
  return(
  <Card sx={{ width: '300px' }}>
    
    <CardMedia
      component="img"
      height="240"
      image={imageUrls[0]}
      alt={`${item.brand} ${item.model}`}
      //src={item.imgUrl[0]}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Typography gutterBottom variant="h5" component="div">
        {item.brand} {item.model}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Condition: {item.condition}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.authenticity ? `Authenticity: ${item.authenticity}` : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Price: ${item.price}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Description: {item.description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography>
    </CardContent>
    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small">View Details</Button>
      <IconButton onClick={() => onDelete(item._id)}>
        <DeleteOutlinedIcon />
      </IconButton>
    </CardActions>
  </Card>
);
}

const AddedItemList = () => {
  const [items, setItems] = useState({ mobiles: [], computers: [], electronics: [], vehicles: [] });
  const [auth]= useAuth();
  const { updateCartSize } = useCart();
  const fetchItems = async () => {
    try {
      
      const mobilesResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/mobiles');
      const computersResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/added-computers');
      const electronicResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/added-electronics');
      const vehicleResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/added-vehicles');
      setItems({ mobiles: mobilesResponse?.data.mobiles, computers: computersResponse?.data.computers,
         electronics: electronicResponse?.data.electronics, vehicles: vehicleResponse?.data.vehicles });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    updateCartSize();
    fetchItems();
    
  }, [auth]);

  const handleDelete = async (itemId, itemType) => {
    try {
      await axios.delete(`https://valo-deal-backend.vercel.app/sell/${itemType}/${itemId}`);
      fetchItems(); // Refresh items after deletion
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Listings
      </Typography>
      <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Render both mobiles and computers */}
        {Object.keys(items).map((key) => (
          items[key]?.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4} lg={3} >
              <ListingCard item={item} onDelete={(itemId) => handleDelete(itemId, key)} />
            </Grid>
          ))
        ))}
      </Grid>
    </Box>
  );
};

export default AddedItemList;