import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, ListItemButton } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

const ListingCard = ({ item, onAddToCart, onRecentlyView, sellerName }) => (
  <Card sx={{ width: '280px' }}>
    <CardMedia
      component="img"
      height="240"
      image={item.imgUrl}
      alt={`${item.brand} ${item.model}`}
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
      <ListItemButton sx={{ padding: '0', mt: '10px', height: '32px' }}>
        Seller: {sellerName || 'Loading...'}
      </ListItemButton>
    </CardContent>
    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => onRecentlyView(item._id)}>View Details</Button>
      <Tooltip title="Add this item to your cart">
        <IconButton onClick={() => onAddToCart(item._id)}>
          <AddShoppingCartSharpIcon sx={{ color: 'rgb(0, 6, 12)' }} />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState({ mobiles: [], computers: [], electronics: [], vehicles: [] });
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const [sellerMap, setSellerMap] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [mobilesResponse, computersResponse, electronicResponse, vehicleResponse] = await Promise.all([
          axios.get('http://localhost:8080/sell/latest-mobiles'),
          axios.get('http://localhost:8080/sell/latest-computers'),
          axios.get('http://localhost:8080/sell/latest-electronics'),
          axios.get('http://localhost:8080/sell/latest-vehicles'),
        ]);
        setItems({
          mobiles: mobilesResponse.data.latestMobile,
          computers: computersResponse.data.latestComputer,
          electronics: electronicResponse.data.latestElectronic,
          vehicles: vehicleResponse.data.latestVehicle,
        });
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
    updateCartSize();
  }, [auth]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const allItems = [
          ...(items.mobiles || []),
          ...(items.computers || []),
          ...(items.electronics || []),
          ...(items.vehicles || []),
        ];
        const sellerIds = new Set(allItems.map((item) => item.sellerId));
        const sellerPromises = Array.from(sellerIds).map((sellerId) =>
          axios.get(`http://localhost:8080/api/v1/auth/seller-info/${sellerId}`)
        );
        const sellerResponses = await Promise.all(sellerPromises);

        const newSellerMap = new Map();
        sellerResponses.forEach((response) => {
          const sellerData = response.data.seller;
          newSellerMap.set(sellerData.sellerId, sellerData);
        });
        setSellerMap(newSellerMap);
      } catch (error) {
        console.error('Error fetching seller info:', error);
      }
    };

    if (items.mobiles.length > 0 || items.computers.length > 0 || items.electronics.length > 0 || items.vehicles.length > 0) {
      fetchSellerInfo();
    }
  }, [items]);

  const handleRecentlyView = async (itemId, itemType) => {
    try {
      await axios.post(`http://localhost:8080/recentlyViewed/${itemType}/${itemId}`);
    } catch (error) {
      console.error(`Error viewing item:`, error);
    }
  };

  const handleCart = async (itemId, itemType) => {
    try {
      await axios.post(`http://localhost:8080/cart/${itemType}/${itemId}`);
      await updateCartSize();
    } catch (error) {
      console.error(`Error adding to cart ${itemType}:`, error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = [
    ...items.mobiles,
    ...items.computers,
    ...items.electronics,
    ...items.vehicles,
  ].slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {auth.user === null ? (
        <Typography variant="h4" gutterBottom>
          Please sign in to browse items
        </Typography>
      ) : (
        <>
          <Box sx={{ p: 3, bgcolor: 'grey' }}>
            <Typography variant="h4" gutterBottom>
              Home
            </Typography>
            <Grid container spacing={3} sx={{ lp: '10px' }}>
              {sellerMap.size !== 0 ? (
                currentPosts.map((item) => (
                  <Grid item key={item._id} xs={12} sm={6} md={4} sx={{ width: '280px' }}>
                    <ListingCard
                      item={item}
                      onAddToCart={(itemId) => handleCart(itemId, item.itemType)}
                      onRecentlyView={(itemId) => handleRecentlyView(itemId, item.itemType)}
                      sellerName={sellerMap.get(item.sellerId)?.name}
                    />
                  </Grid>
                ))
              ) : (
                <Typography>Loading...</Typography>
              )}
            </Grid>
          </Box>
          <Pagination
            count={Math.ceil(currentPosts.length / postsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '10px' }}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
