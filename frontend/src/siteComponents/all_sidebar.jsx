import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link as RouterLink } from 'react-router-dom';
import NestedSidebar from './nested_sidebar';
import { useState } from 'react';
import { useAuth } from '../context/auth';

export default function AllDrawer() {
  const [openMainDrawer, setOpenMainDrawer] = useState(false);
  const [openSubDrawer, setOpenSubDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const toggleMainDrawer = (newOpen) => () => {
    setOpenMainDrawer(newOpen);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setOpenSubDrawer(true);
    setOpenMainDrawer(false); // Close the main drawer when opening the sub drawer
  };

  const handleSubDrawerClose = () => {
    setOpenSubDrawer(false);

  };

  const handleMainMenuClick = () => {
    setOpenSubDrawer(false);
    setOpenMainDrawer(true);
  };

  const [auth] = useAuth();

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" onClick={toggleMainDrawer(false)}>
      <List sx={{ paddingTop: 0, justifyContent: 'flex-start', color: 'rgb(27, 37, 54)' }}>
        <ListItem disablePadding>
          {!auth.user ? (<ListItemButton
            component={RouterLink}
            to="/login"
            sx={{
              justifyContent: 'flex-start',
              color: 'white',
              bgcolor: 'rgb(27, 37, 54)',
              width: '250px',
              height: '60px',
              marginTop: '0px',
              borderRadius: '0px',
              '&:hover': {
                bgcolor: 'rgb(27, 37, 54)',
              },
            }}
            onClick={toggleMainDrawer(true)}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              <AccountCircleOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
            </ListItemIcon>
            <ListItemText
              primary="Hello, Sign in"
              primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}
            />
          </ListItemButton>) : (
            <ListItemButton
              sx={{
                justifyContent: 'flex-start',
                color: 'white',
                bgcolor: 'rgb(27, 37, 54)',
                width: '250px',
                height: '60px',
                marginTop: '0px',
                borderRadius: '0px',
                '&:hover': {
                  bgcolor: 'rgb(27, 37, 54)',
                },
              }}
            >
              <ListItemText
                primary={`Hello, ${auth.user.name}`}
                primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}
                sx={{ justifyContent: 'flex-start' }}

              />
            </ListItemButton>)}
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Shop by Department"
            primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}
          />
        </ListItem>
        {['Electronics', 'Computers', 'Smart home', 'Automotive'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleCategoryClick(text)}>
              <ListItemText
                primary={text}
                primaryTypographyProps={{ color: 'rgb(0, 7, 20)', fontSize: 'h7.fontSize' }}
              />
              <ListItemIcon>
                <ArrowForwardIosOutlinedIcon sx={{ color: 'rgb(0, 7, 20)' }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ color: 'rgb(0, 7, 20)' }} />
      <List>
        <ListItem>
          <ListItemText
            primary="Help & Settings"
            primaryTypographyProps={{ fontWeight: 'bold', fontSize: 'h6.fontSize' }}
          />
        </ListItem>
        <ListItemButton>
          <ListItem>

            <ListItemText
              primary="Your Account"
              primaryTypographyProps={{ fontSize: 'h7.fontSize' }}
            />
          </ListItem>
        </ListItemButton>

        {/* {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
              <ListItemIcon>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))} */}
      </List>
    </Box>
  );

  return (
    <div>
      <Button
        sx={{
          color: 'white',
          fontSize: 18,
          textTransform: 'none',
          '& .MuiButton-startIcon': {
            marginRight: '5px',
          },
        }}
        onClick={toggleMainDrawer(true)}
        startIcon={<MenuIcon sx={{ color: 'aliceblue' }} style={{ fontSize: 35 }} />}
      >
        All
      </Button>
      <Drawer
        open={openMainDrawer}
        onClose={toggleMainDrawer(false)}
        transitionDuration={800}
      >
        {DrawerList}
      </Drawer>
      <NestedSidebar
        open={openSubDrawer}
        onClose={handleSubDrawerClose}
        category={selectedCategory}
        onMainMenuClick={handleMainMenuClick}
      />
    </div>
  );
}
