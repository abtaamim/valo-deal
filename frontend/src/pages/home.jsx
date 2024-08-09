import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, ListItemButton } from '@mui/material';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Pagination from '@mui/material/Pagination';
const ListingCard = ({ item, onAddToCart, onRecentlyView, sellerName }) => (
  <Card sx={{ width: '280px' }}>
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
      <Typography variant="body2" color="text.secondary">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography>
      {/* <Typography variant="body2" color="text.secondary"> */}
      <ListItemButton sx={{ padding: '0', mt: '10px', height: '32px' }}>

        Seller : {sellerName}
      </ListItemButton>
      {/* </Typography> */}
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

const HomePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState({ mobiles: [], computers: [], electronics: [], vehicles: [] });
  const [auth] = useAuth();
  //console.log('auth: ', auth)
  const { updateCartSize } = useCart();

  const [sellerMap, setSellerMap] = useState(new Map());

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
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
      const mobilesResponse = await axios.get('http://localhost:8080/sell/latest-mobiles');
      console.log('Mobiles Response:', mobilesResponse.data);
      const computersResponse = await axios.get('http://localhost:8080/sell/latest-computers');
      console.log('Computer Response:', computersResponse.data);
      const electronicResponse = await axios.get('http://localhost:8080/sell/latest-electronics');
      console.log('Electronic Response:', electronicResponse.data);
      const vehicleResponse = await axios.get('http://localhost:8080/sell/latest-vehicles');
      console.log('Vehicle Response:', vehicleResponse.data);
      setItems({ mobiles: mobilesResponse.data.latestMobile, computers: computersResponse.data.latestComputer,
         electronics: electronicResponse.data.latestElectronic, vehicles: vehicleResponse.data.latestVehicle  });

    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  // useEffect(() => {
  //   console.log('<<<<>>>', items.mobiles)
  //   console.log('<<<<>>>', items.computers)
  //   console.log('<<<<>>>', items.electronics)
  // }, [items])

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log('User is not authenticated.');
      // Handle unauthenticated state (e.g., redirect)
    } else {
      console.log('User is authenticated.');
    }
    fetchItems();
    updateCartSize();
    //navigate("/");
  }, []);

  // const handleDelete = async (itemId, itemType) => {
  //   try {
  //     await axios.delete(`http://localhost:8080/sell/${itemType}/${itemId}`);
  //     fetchItems(); // Refresh items after deletion
  //   } catch (error) {
  //     console.error(`Error deleting ${itemType}:`, error);
  //   }
  // };
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
      // fetchItems(); // Refresh items after deletion
      await updateCartSize();
      console.log(itemType)
    } catch (error) {
      console.error(`Error adding to cart ${itemType}:`, error);
    }
  };

  //for seller info and pagination
  const [allitems, setallitems] = useState([]);
  useEffect(() => {
    const allItems = [
      ...(items.mobiles || []),
      ...(items.computers || []),
      ...(items.electronics || []),
      ...(items.vehicles || []),
    ];
    setallitems(allItems);
  }, [items])


  const fetchSellerInfo = async () => {
    try {

      // Use a Set to avoid duplicate seller IDs
      const sellerIds = new Set(allitems.map((item) => item.sellerId));

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
  useEffect(() => {
    fetchSellerInfo();
  }, [items]);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allitems.slice(indexOfFirstPost, indexOfLastPost);
  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      {auth.user === null ? (<Typography variant="h4" gutterBottom>
        Plese signIn to browse Item
      </Typography>) :
        (<>
          <Box sx={{ p: 3, bgcolor: 'grey' }}>
            <Typography variant="h4" gutterBottom>
              home
            </Typography>
            <Grid container spacing={3} sx={{ lp: '10px' }} >
              {currentPosts.map((item) => (
                <Grid item key={item._id} xs={12} sm={6} md={4} sx={{ width: '280px' }}>

                  <ListingCard item={item} onAddToCart={(itemId) => handleCart(itemId, item.itemType)}
                    onRecentlyView={(itemId) => handleRecentlyView(itemId, item.itemType)}
                    sellerName={sellerMap.get(item.sellerId)?.name}
                  />
                </Grid>
              ))

              }
            </Grid>
          </Box>
          <Pagination count={Math.ceil(allitems.length / postsPerPage)}
           page={currentPage} onChange={handlePageChange} 
           color="secondary"
           sx={{display:'flex', justifyContent: 'center', alignItems:'center', mt:'10px' }} />
        </>)
      }

    </>
  );
};

export default HomePage;
