import React, { useState, useEffect } from 'react'; // ✅ added useEffect import
import { Box, Card, CardContent, ListItemIcon, ListItemButton, ListItemText, ListItem, List, Divider, Grid, Typography, Tooltip } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import CategorySelection from './categorySelection';
import { useAuth } from '../context/auth';
import { customAxios } from '../api/axiosPrivate';
function customListButton(string, onClick) {
  return (
    <ListItemButton onClick={onClick} sx={{ justifyContent: 'space-between', width: '100%' }}>
      <ListItemText
        primary={
          <Typography variant="h8" >
            {string}
          </Typography>
        }
      />
      <ListItemIcon>
        <ArrowForwardIosOutlinedIcon sx={{ color: 'rgb(0, 7, 20)' }} />
      </ListItemIcon>
    </ListItemButton>
  );
}

const Sell = () => {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [auth] = useAuth();

  const fetchCategory = async () => {
    try {
      const res = await customAxios.get("/category/category-tree");
      console.log(res.data)
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    console.log("Updated items:", items);
  }, [items]);

  const handleOpenCategoryDialog = () => {
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // setOpenCategoryDialog(false); // Close dialog after selecting category
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        bgcolor: 'transparent',
        position: 'relative',
        top: '-10px' // Adjust this value to move the card higher or lower
      }}
    >
      <Card variant="outlined" sx={{ width: '900px', backgroundColor: 'white', color: 'rgb(0, 7, 20)', borderColor: 'transparent' }}>
        <CardContent>
          <Typography variant='h8' fontWeight="bold" sx={{ display: 'flex', justifyContent: 'center', pt: '20px' }}>
            Welcome {`${auth.user.name}`}! Let's post an ad.
          </Typography>
          <Typography sx={{ mb: '40px', display: 'flex', justifyContent: 'center' }}>
            choose any option below
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 2, height: '218px' }}>
                <CardContent>
                  <List sx={{ width: '100%', bgcolor: 'background.paper', flexDirection: 'column' }}>
                    <ListItem alignItems="center">
                      <ListItemText primary={<Typography variant="h6" fontWeight="bold">Sell something</Typography>} />
                    </ListItem>
                    <Divider sx={{ width: '100%' }} />
                    {customListButton('Sell an item', handleOpenCategoryDialog)}
                    <Divider sx={{ width: '100%' }} />
                    {customListButton('Offer a property for rent', handleOpenCategoryDialog)}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <List sx={{ width: '100%', bgcolor: 'background.paper', flexDirection: 'column' }}>
                    <ListItem alignItems="center">
                      <ListItemText primary={<Typography variant="h6" fontWeight="bold">Post a job vacancy</Typography>} />
                    </ListItem>
                    <Divider sx={{ width: '100%' }} />
                    <Tooltip title="service not available" titleColor='red' sx={{ color: 'red', fontSize: '20px' }}>
                      {customListButton('Post a job in Bangladesh')}
                    </Tooltip>
                    <Divider sx={{ width: '100%' }} />
                    {customListButton('Post a job overseas')}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <List sx={{ width: '100%', bgcolor: 'background.paper', flexDirection: 'column' }}>
                    <ListItem alignItems="center">
                      <ListItemText primary={<Typography variant="h6" fontWeight="bold">Look for something</Typography>} />
                    </ListItem>
                    <Divider sx={{ width: '100%' }} />
                    {customListButton('Look for property')}
                    <Divider sx={{ width: '100%' }} />
                    {customListButton('Look for something to buy')}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <CategorySelection
        open={openCategoryDialog}
        handleClose={handleCloseCategoryDialog}
        handleCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        items={items}
      />
    </Box>
  );
}

export default Sell;