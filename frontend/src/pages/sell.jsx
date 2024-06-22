import React, { useState } from 'react';
import { Button, Divider, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, ListItemIcon, ListItemButton, Typography, Box } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const Sell = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const items = {
    Mobiles: ['Computer Components', 'Data Storage', 'External Components', 'Laptop Accessories', 'Monitor', 'Networking Products'],
    Electronics: ['Desktop Computres', 'Laptops', 'Computer & Laptop Accessories', 'TVs', 'Cameras',
      'ACs & Home Appliances', 'Photocopies', 'Other Electronics'],
    Vehicles: ['Car', 'Motorbikes', 'Bicycles', 'Auto Parts & Accessories'],
    'Home & Living': [],
    "Men's Fashion & Grooming ": [],
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open Sell Dialog
      </Button> */}
      <Dialog open={handleClickOpen} onClose={handleClose} fullWidth maxWidth="md">
        {/* <DialogTitle>Select a Category</DialogTitle> */}

        <DialogContent>

          <Box display="flex" sx={{ flexDirection: 'row', height: '700px' }}>
            <div width='350px'>
              <Typography variant="h6" sx={{ fontWeight: "bold", width: '100%', marginTop: '10px', paddingTop: '10px', paddingLeft: '21px' }}>
                Select a category
              </Typography>
              <List sx={{ height: '100%', width: '350px', borderRight: '1px solid', color: 'rgb(0, 7, 20)' }}>
                {Object.keys(items).map((category, index) => (
                  <React.Fragment key={category}>
                    <ListItemButton
                      onClick={() => handleCategorySelect(category)}
                      sx={{
                        width: '100%', backgroundColor: selectedCategory === category ? 'rgb(0, 7, 20)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'white',
                          color: 'black'
                        }
                      }}
                    >
                      <ListItem disablePadding key={category} >
                        <ListItemText primary={category} sx={{'&:hover': {
                          //backgroundColor: 'white',
                          color: 'black'
                        }, color: selectedCategory === category ? 'white' : 'rgb(0, 7, 20)' }} />
                        <ListItemIcon>
                          <ArrowForwardIosOutlinedIcon sx={{ color: selectedCategory === category ? 'white' : 'rgb(0, 7, 20)' }} />
                        </ListItemIcon>

                      </ListItem>

                    </ListItemButton>
                    {index < Object.keys(items).length - 1 && <Divider sx={{ color: 'rgb(0, 7, 20)' }} />}
                  </React.Fragment>
                )

                )}
              </List>
            </div>
            <Box sx={{ height: '100%', width: '50%', padding: '0 1rem' }}>
              {selectedCategory ? (
                <>
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: '10px', paddingTop: '10px', paddingLeft: '15px' }}>
                    Select a Sub category
                  </Typography>
                  <List>

                    {items[selectedCategory].map((subCategory, index) => (
                      <React.Fragment key={subCategory}>
                        <ListItemButton >
                          <ListItem disablePadding>
                            <ListItemText primary={subCategory} />
                          </ListItem>
                        </ListItemButton>
                        {index < items[selectedCategory].length - 1 && <Divider />}
                      </React.Fragment>
                    ))}

                  </List>
                </>
              ) : (
                <Typography variant="h6" sx={{ marginTop: '0px', paddingTop: '0px' }}>

                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

      </Dialog>
    </div>
  );
};

export default Sell;
