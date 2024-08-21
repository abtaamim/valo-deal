import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Tooltip, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, ListItemButton,
  MenuItem, FormControl, Select, InputLabel, Pagination
} from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import image1 from '../assests/h1.jpg';
import image2 from '../assests/h2.jpg';
import image3 from '../assests/h3.jpg';
import image4 from '../assests/h4.jpg';

const HomeSlider = () => (
  <Box sx={{ marginBottom: '10px' }}>
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      interval={3000}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <Box
            onClick={onClickHandler}
            title={label}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '130px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: '60px',
              zIndex: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            &#10094;
          </Box>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <Box
            onClick={onClickHandler}
            title={label}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: '130px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: '60px',
              zIndex: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            &#10095;
          </Box>
        )
      }
    >
      <div>
        <img src={image1} alt="Essentials for Gamers" style={{ height: '300px', objectFit: 'cover' }} />
      </div>
      <div>
        <img src={image2} alt="Deals in PCs" style={{ height: '300px', objectFit: 'cover' }} />
      </div>
      <div>
        <img src={image3} alt="Home décor under $50" style={{ height: '300px', objectFit: 'cover' }} />
      </div>
      <div>
        <img src={image4} alt="Shop deals in Fashion" style={{ height: '300px', objectFit: 'cover' }} />
      </div>
    </Carousel>
  </Box>
);

const ListingCard = ({ item, onAddToCart, onRecentlyView, sellerName }) => (
  <Card sx={{ width: '280px' }}>
    <CardMedia
      component="img"
      height="240"
      image={item.imgUrl[1]}
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
      <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography>
      <ListItemButton sx={{ padding: '0', mt: '10px', height: '32px' }}>
        Seller : {sellerName}
      </ListItemButton>
    </CardContent>
    <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => onRecentlyView(item._id)}>View Details</Button>
      <Tooltip title='Add this item to your cart'>
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

  const [postsPerPage] = useState(12);
  const [sortOrder, setSortOrder] = useState('');
  const [allItems, setAllItems] = useState([]);


  const fetchItems = async () => {
    try {
      const mobilesResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/latest-mobiles');
      const computersResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/latest-computers');
      const electronicResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/latest-electronics');
      const vehicleResponse = await axios.get('https://valo-deal-backend.vercel.app/sell/latest-vehicles');
      setItems({
        mobiles: mobilesResponse.data.latestMobile,
        computers: computersResponse.data.latestComputer,
        electronics: electronicResponse.data.latestElectronic,
        vehicles: vehicleResponse.data.latestVehicle
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('User is not authenticated.');
    } else {
      console.log('User is authenticated.');
    }
    fetchItems();
    updateCartSize();

  }, []);


  const handleRecentlyView = async (itemId, itemType) => {
    try {
      await axios.post(`https://valo-deal-backend.vercel.app/recentlyViewed/${itemType}/${itemId}`);
    } catch (error) {
      console.error(`Error viewing item:`, error);
    }
  };

  const handleCart = async (itemId, itemType) => {
    try {
      await axios.post(`https://valo-deal-backend.vercel.app/cart/${itemType}/${itemId}`);
      await updateCartSize();
      console.log(itemType);
    } catch (error) {
      console.error(`Error adding to cart ${itemType}:`, error);
    }
  };

  useEffect(() => {
    const allItems = [
      ...(items.mobiles || []),
      ...(items.computers || []),
      ...(items.electronics || []),
      ...(items.vehicles || []),
    ];
    setAllItems(allItems);
  }, [items]);

  const fetchSellerInfo = async () => {
    try {
      const sellerIds = new Set(allItems.map((item) => item.sellerId));
      const sellerPromises = Array.from(sellerIds).map((sellerId) =>
        axios.get(`https://valo-deal-backend.vercel.app/api/v1/auth/seller-info/${sellerId}`)
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

  useEffect(() => {
    fetchSellerInfo();
  }, [items]);

  // Handle Sorting
  const handleSortChange = (event) => {
    const sortOrder = event.target.value;
    setSortOrder(sortOrder);

    const sortedItems = [...allItems].sort((a, b) => {
      if (sortOrder === 'lowToHigh') {
        return a.price - b.price;
      } else if (sortOrder === 'highToLow') {
        return b.price - a.price;
      } else {
        return 0;
      }
    });

    setAllItems(sortedItems);
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allItems.slice(indexOfFirstPost, indexOfLastPost);

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
          <HomeSlider /> {/* Include the slider here */}
          <Box sx={{ p: 2, bgcolor: '#FAF9F6' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControl sx={{ minWidth: 380 }}>
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortOrder}
                  onChange={handleSortChange}
                  label="Sort by"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                  <MenuItem value="highToLow">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={3}>
              {currentPosts.map((item) => (

                <Grid item key={item._id} xs={12} sm={6} md={2}>
                  <ListingCard
                    item={item}
                    onAddToCart={(itemId) => handleCart(itemId, item.itemType)}

                    onRecentlyView={(itemId) => handleRecentlyView(itemId, item.itemType)}
                    sellerName={sellerMap.get(item.sellerId)?.name || ''}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(allItems.length / postsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default HomePage;
