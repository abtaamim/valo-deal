import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ListItemIcon, ListItemButton, ListItemText, ListItem, List, Divider, Grid, Typography } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import CategorySelection from './categorySelection';
import { useState } from 'react';
function customListButton(string,onClick) {
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

  const items = {
    Mobiles:['Mobile Phones', 'Mobile Phone Accessories', 'Wearables'],
    Computers: ['Computer Components', 'Data Storage', 'External Components', 'Laptop Accessories', 'Monitor', 'Networking Products'],
    Electronics: ['Desktop Computers', 'Laptops', 'Computer & Laptop Accessories', 'TVs', 'Cameras', 'ACs & Home Appliances', 'Photocopies', 'Other Electronics'],
    Vehicles: ['Car', 'Motorbikes', 'Bicycles', 'Auto Parts & Accessories'],
    'Home & Living': [],
    "Men's Fashion & Grooming": [],
  };

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
      <Card variant="outlined" sx={{ width: '900px', backgroundColor: 'white', color: 'rgb(0, 7, 20)' ,borderColor:'transparent' }}>
        <CardContent>
          <Typography variant='h8' fontWeight="bold">
            Welcome Tamim! Let's post an ad. 
          </Typography>
          <Typography sx={{mb:'40px'}}>
            choose any option below
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 2, height:'218px' }}>
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
                    {customListButton ('Post a job in Bangladesh' )}
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