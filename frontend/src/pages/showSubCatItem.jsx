import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useParams } from 'react-router-dom';
const ListingCard = ({ item, onAddToCart, onRecentlyView }) => (
  <Card sx={{ width: '300px' }}>
    <CardMedia
      component="img"
      height="240"
      image={item.imgUrl}
      alt={`${item.brand} ${item.model}`}
      src={item.imgUrl}
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
      {/* <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography> */}
    </CardContent>
    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => onRecentlyView(item._id)}>View Details</Button>
      <Tooltip title='add this item to tour cart'>
        <IconButton onClick={() => onAddToCart(item._id)}>
          <AddShoppingCartSharpIcon sx={{ color: 'rgb(0, 6, 12)' }} />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

const ShowSubCatItem = () => {
  const [items, setItems] = useState([]);
  const [auth] = useAuth();
  const { category, subCat } = useParams();
  const { updateCartSize } = useCart();
  const fetchItems = async () => {
    try {
      // const token = auth?.token; 
      // console.log(token);
      // if (!token) {
      //   throw new Error("No token found");
      // }
      // const headers = { Authorization: `Bearer ${token}` };

      // console.log("header::::")
      // console.log(headers);
      let response = null;
      if (subCat.toLowerCase() === 'mobile phone accessories') {
        response = await axios.get(`http://localhost:8080/sell/mobileAcc/${subCat}`);
        setItems(response.data.mobileAcc);
      }
      else if (subCat.toLowerCase() === 'mobile phones') {
        response = await axios.get(`http://localhost:8080/sell/${category.toLowerCase()}/${subCat}`);
        setItems(response.data.mobiles);
      }


      else {
        response = await axios.get(`http://localhost:8080/sell/${category.toLowerCase()}/${subCat}`);
        setItems(response.data[category.toLowerCase()]);
      }

      console.log('Mobiles Response:', response.data);



    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    updateCartSize();
    setItems("")
  }, [subCat,auth]);

  const catLow = category.toLowerCase();
  const handleRecentlyView = async (itemId, catLow) => {
    try {
      await axios.post(`http://localhost:8080/recentlyViewed/${catLow}/${itemId}`);
    } catch (error) {
      console.error(`Error viewing item:`, error);
    }
  };

  const handleCart = async (itemId, catLow) => {
    try {
      await axios.post(`http://localhost:8080/cart/${catLow}/${itemId}`);
      // fetchItems(); // Refresh items after deletion
      await updateCartSize();

    } catch (error) {
      console.error(`Error adding to cart ${catLow}:`, error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {subCat}
        </Typography>
        <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Render both mobiles and computers */}
          {items?.length === 0 ? (
            <Typography variant="h6" color="text.secondary">
              No items available in this category.
            </Typography>
          ) :
            (
              items?.map((item) => (
                <Grid item key={item._id} xs={12} sm={6} md={3}>
                  <ListingCard item={item} onAddToCart={(itemId) => handleCart(itemId, catLow)}
                    onRecentlyView={(itemId) => handleRecentlyView(itemId, catLow)}
                  />
                </Grid>
              ))
            )
          }
        </Grid>
      </Box>
    </>
  );
};

export default ShowSubCatItem;
