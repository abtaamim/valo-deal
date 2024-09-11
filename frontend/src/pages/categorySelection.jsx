import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, List, ListItemButton, ListItemText, ListItem, ListItemIcon, Typography, Divider } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

const CategorySelection = ({ open, handleClose, handleCategorySelect, selectedCategory, items }) => {
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [showMobileAccessoriesDialog, setShowMobileAccessoriesDialog] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSubcategory = (subCategory) => {
    if (selectedCategory === 'Computers') {
      navigate('/sell/computers', { state: { subCategory } });
    } else if (selectedCategory === 'Electronics') {
      navigate('/sell/electronics', { state: { subCategory } });
    } else if (selectedCategory === 'Vehicles') {
      navigate('/sell/vehicles', { state: { subCategory } });
    }
    if (subCategory === 'Mobile Phones') {
      setShowMobileDialog(true);
    } else if (subCategory === 'Mobile Phone Accessories') {
      setShowMobileAccessoriesDialog(true);
    }
  };

  useEffect(() => {
    if (showMobileDialog) {
      navigate('/sell-mobile');
    }
  }, [showMobileDialog, navigate]);

  useEffect(() => {
    if (showMobileAccessoriesDialog) {
      navigate('/sell/mobile-accessories');
    }
  }, [showMobileAccessoriesDialog, navigate]);

  const handleCloseMobileDialog = () => {
    setShowMobileDialog(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '700px' }}>
            <div style={{ width: isMobile ? '100%' : '350px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', width: '100%', marginTop: '10px', paddingTop: '10px', paddingLeft: '21px' }}>
                Select a category
              </Typography>
              <List sx={{ height: '100%', width: isMobile ? '100%' : '350px', borderRight: isMobile ? 'none' : '1px solid', borderColor: 'rgb(0, 7, 20)' }}>
                {Object.keys(items).map((category, index) => (
                  <React.Fragment key={category}>
                    <ListItemButton
                      onClick={() => handleCategorySelect(category)}
                      sx={{
                        width: '100%',
                        backgroundColor: selectedCategory === category ? 'rgb(0, 7, 20)' : 'white',
                        '&:hover': {
                          backgroundColor: 'rgb(227, 242, 247)',
                          color: 'darkorange',
                        },
                      }}
                    >
                      <ListItem disablePadding>
                        <ListItemText
                          primary={category}
                          sx={{
                            color: selectedCategory === category ? 'white' : 'rgb(0, 7, 20)',
                            '&:hover': {
                              backgroundColor: 'rgb(227, 242, 247)',
                              color: 'orange',
                            },
                          }}
                        />
                        <ListItemIcon>
                          <ArrowForwardIosOutlinedIcon
                            sx={{
                              color: selectedCategory === category ? 'white' : 'rgb(0, 7, 20)',
                              '&:hover': {
                                backgroundColor: 'white',
                                color: 'darkorange',
                              },
                            }}
                          />
                        </ListItemIcon>
                      </ListItem>
                    </ListItemButton>
                    {index < Object.keys(items).length - 1 && <Divider sx={{ color: 'rgb(0, 7, 20)' }} />}
                  </React.Fragment>
                ))}
              </List>
            </div>
            <div style={{ height: '100%', width: isMobile ? '100%' : '50%', padding: '0 1rem', marginTop: isMobile ? '1rem' : '0' }}>
              {selectedCategory ? (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px', paddingTop: '10px' }}>
                    Select a Sub category
                  </Typography>
                  <List>
                    {items[selectedCategory].map((subCategory, index) => (
                      <React.Fragment key={subCategory}>
                        <ListItemButton onClick={() => handleSubcategory(subCategory)}>
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategorySelection;
