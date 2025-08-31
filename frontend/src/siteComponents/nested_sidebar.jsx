
import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { Typography } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AllDrawer from './all_sidebar';
import { useMediaQuery } from '@mui/material';
import { customAxios } from '../api/axiosPrivate';
const NestedSidebar = ({ open, onClose, category, onMainMenuClick, cat_name }) => {
  const [child_cat, setChild_cat] = useState()
  const get_child_cat = async () => {
    try {
      const res = await customAxios.get(`/category/child-cat/${category}`)
      const child_cat = res.data;

      setChild_cat(child_cat);
    } catch (error) {
      //  console.log("Error gsm product_name: ", error);
    }
  }
  useEffect(() => {
    get_child_cat()
  }, [category]);
  const items = {
    Mobiles: ['Mobile Phones', 'Mobile Phone Accessories', 'Wearables'],
    Computers: ['Computer Components', 'Data Storage', 'External Components', 'Laptop Accessories', 'Monitor', 'Networking Products'],
    Electronics: ['Desktop Computers', 'Laptops', 'Computer & Laptop Accessories', 'TVs', 'Cameras', 'ACs & Home Appliances', 'Photocopies', 'Other Electronics'],
    Vehicles: ['Car', 'Motorbikes', 'Bicycles', 'Auto Parts & Accessories'],
    'Home & Living': [],
    "Men's Fashion & Grooming": [],
  };
  const isXs = useMediaQuery('(max-width:450px)');
  const DrawerList = (
    <Box sx={{ width: isXs ? 250 : 350 }} role="presentation">
      <List sx={{ paddingTop: 0, justifyContent: 'flex-start', color: 'rgb(27, 37, 54)' }}>


        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/signin"
            sx={{
              justifyContent: 'flex-start',
              color: 'white', bgcolor: 'rgb(27, 37, 54)',
              width: '250px', height: '60px',
              marginTop: '0px', borderRadius: '0px',
              '&:hover': { bgcolor: 'rgb(27, 37, 54)' },
            }} onClick={onClose}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <AccountCircleOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
            </ListItemIcon>
            <ListItemText
              primary="Hello, Sign in"
              primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ justifyContent: 'flex-start' }}
            onClick={onMainMenuClick}
          >

            <ListItemIcon sx={{ minWidth: 25 }}>
              <ArrowBackOutlinedIcon sx={{ color: 'rgb(0, 7, 20)' }} />
            </ListItemIcon>
            <ListItemText
              primary="MAIN MENU"
              primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h8.fontSize' }}
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={cat_name}
            primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}
          />
        </ListItem>
        {child_cat?.map((subCat) => (
          <ListItem key={subCat.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={`/sub-category-item/${cat_name}/${subCat.name}`}
              onClick={onClose}>
              <ListItemText primary={subCat.name} primaryTypographyProps={{ color: 'rgb(0, 7, 20)', fontSize: 'h7.fontSize' }} />
              <ListItemIcon>
                <ArrowForwardIosOutlinedIcon sx={{ color: 'rgb(0, 7, 20)' }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ color: 'rgb(0, 7, 20)' }} />
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
              <ListItemIcon>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <Drawer transitionDuration={800} anchor="left" open={open} onClose={onClose}>
      {DrawerList}
    </Drawer>
  );
};

export default NestedSidebar;
