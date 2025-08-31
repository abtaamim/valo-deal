import * as React from 'react';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
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
import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { customAxios } from '../api/axiosPrivate';
export default function AllDrawer() {
  const [openMainDrawer, setOpenMainDrawer] = useState(false);
  const [openSubDrawer, setOpenSubDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [parent_cat, setParent_cat] = useState()
  const [cat_name, setCat_name] = useState()
  const toggleMainDrawer = (newOpen) => () => {
    setOpenMainDrawer(newOpen);
  };

  const get_parent_cat = async () => {
    try {
      const res = await customAxios.get('/category/parent-cat')
      const parent_cat = res.data;

      setParent_cat(parent_cat);
    } catch (error) {
      //  console.log("Error gsm product_name: ", error);
    }
  }
  useEffect(() => {
    get_parent_cat()
  }, []);
  const handleCategoryClick = (category, cat_name) => {
    setSelectedCategory(category);
    setCat_name(cat_name)
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
  const isXs = useMediaQuery('(max-width:450px)');
  const DrawerList = (
    <Box sx={{ width: isXs ? 250 : 350 }} role="presentation" onClick={toggleMainDrawer(false)}>
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
        {/* ['Electronics', 'Computers', 'Mobiles', 'Vehicles'] */}
        {parent_cat?.map((cat) => (
          <ListItem key={cat.name} disablePadding>
            <ListItemButton onClick={() => handleCategoryClick(cat._id, cat.name)}>
              <ListItemText
                primary={cat.name}
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
        <ListItemButton >
          <ListItem>

            <ListItemText
              primary="My Account"
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
        cat_name={cat_name}
      />
    </div>
  );
}
