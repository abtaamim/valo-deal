import React, { useState } from 'react';
import { Dialog, DialogContent, List, ListItemButton, ListItemText, ListItem, ListItemIcon, Typography, Divider } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

const CategorySelection = ({ open, handleClose, handleCategorySelect, selectedCategory, items }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'row', height: '700px' }}>
          <div style={{ width: '350px' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", width: '100%', marginTop: '10px', paddingTop: '10px', paddingLeft: '21px' }}>
              Select a category
            </Typography>
            <List sx={{ height: '100%', width: '350px', borderRight: '1px solid', borderColor: 'rgb(0, 7, 20)' }}>
              {Object.keys(items).map((category, index) => (
                <React.Fragment key={category}>
                  <ListItemButton
                    onClick={() => handleCategorySelect(category)}
                    sx={{
                      width: '100%',
                      backgroundColor: selectedCategory === category ? 'rgb(0, 7, 20)' : 'white',
                      '&:hover':  {
                        backgroundColor: 'rgb(227, 242, 247)',
                        color: 'darkorange'
                      },
                      
                     // color:selectedCategory === category ? 'white' : 'rgb(0, 7, 20)',
                    }}
                  >
                    <ListItem disablePadding>
                      <ListItemText primary={category} sx={{ color: selectedCategory === category ? 'white' : 'rgb(0, 7, 20)',
                        '&:hover': {
                        backgroundColor: 'rgb(227, 242, 247)',
                        color: 'orange'
                      }
                       }} />
                      <ListItemIcon>
                        <ArrowForwardIosOutlinedIcon sx={{ color: selectedCategory === category ? 'white' : 'rgb(0, 7, 20)',
                          '&:hover': {
                        backgroundColor: 'white',
                        color: 'darkorange'
                      }
                         }} />
                      </ListItemIcon>
                    </ListItem>
                  </ListItemButton>
                  {index < Object.keys(items).length - 1 && <Divider sx={{ color: 'rgb(0, 7, 20)' }} />}
                </React.Fragment>
              ))}
            </List>
          </div>
          <div style={{ height: '100%', width: '50%', padding: '0 1rem' }}>
            {selectedCategory ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: '10px', paddingTop: '10px', paddingLeft: '15px' }}>
                  Select a Sub category
                </Typography>
                <List>
                  {items[selectedCategory].map((subCategory, index) => (
                    <React.Fragment key={subCategory}>
                      <ListItemButton>
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
  );
};

export default CategorySelection;
