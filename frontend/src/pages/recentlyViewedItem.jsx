import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Drawer, Divider, Box, Typography, Button, IconButton, Tooltip, Container } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp';
import ListingCard from './CustomItemCard';
import CustomDialog from './CustomDialog';
import { format, set } from 'date-fns';
import { useAuth } from '../context/auth';
//import { useCart } from '../context/CartContextContext';
import CloseIcon from '@mui/icons-material/Close';
import Column from 'antd/es/table/Column';

const RecentlyViewedItemPage = () => {
  const [recentlyViewedItems, setrecentlyViewedItems] = useState([]);
  const [auth] = useAuth();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [searchedIds, setSearchedIds] = useState([]);
  const [checkSelected, setCheckSelected] = useState([]);

  const handleClickOpen = (itemId) => {
    setOpen(true);
    setSelectedItemId(itemId);
    console.log(selectedItemId)
    console.log(open)
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItemId(null);
  };

  const fetchSearchItems = async () => {
    try {
      const res = await axios.get('http://localhost:8080/search/fetch/searched-items');
      const fetchedSearchItems = res.data.searchedItems;
      setSearchItems(fetchedSearchItems);

      const ids = fetchedSearchItems.map(item => item.id);
      setSearchedIds(ids);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchItems = async () => {
    try {
      const token = auth?.token;
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get('http://localhost:8080/recentlyViewed/fetchitems');
      setrecentlyViewedItems(response.data.recentlyViewedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchSearchItems();
    fetchItems();
  }, [auth]);

  useEffect(() => {
    if (searchedIds.length > 0) {
      setCheckSelected(searchedIds.map(id => ({ id: id, selected: false })));
    }
  }, [searchedIds]);
  //  const selectedForDelete=[];
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const toggleCheckBox = (id) => {
    setCheckSelected(prevState =>
      prevState.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
    setSelectAll(false);
    setSelectedForDelete(prevSelectedForDelete => {
      console.log('Previous selectedForDelete:', prevSelectedForDelete);

      if (Array.isArray(prevSelectedForDelete)) {
        if (prevSelectedForDelete.includes(id)) {

          return prevSelectedForDelete.filter(itemId => itemId !== id);
        } else {

          return [...prevSelectedForDelete, id];
        }
      } else {
        console.warn('selectedForDelete is not an array. Resetting to array with id:', id);
        return [id];
      }
    });


  };

  const [selectAll, setSelectAll] = useState(false);
  const handleSelectAll = () => {
    if (selectAll === false) {
      setSelectAll(true);
      setCheckSelected(searchedIds.map(id => ({ id: id, selected: true })));
      setSelectedForDelete(searchedIds.map(id => (id)))
      return;
    } else {
      setSelectAll(false);
      setCheckSelected(searchedIds.map(id => ({ id: id, selected: false })));
      setSelectedForDelete([]);
      return;
    }
  }
  //console.log(selectedForDelete);
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/recentlyViewed/${itemId}`);
      fetchItems();

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteSearch = async () => {
    if (selectedForDelete.length > 0) {
      try {
        await axios.delete('http://localhost:8080/search/delete', {
          data: { selectedForDelete }
        });
        fetchSearchItems();
      } catch (error) {
        console.error('Error deleting searched item:', error);
      }
      
    } else {
      console.warn('No items selected for deletion.');
    }
  };
  
  return (
    <Box sx={{ bgcolor: 'rgba(32, 33, 36, 1)', p: '0', m: '0' }}>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <Box sx={{ width: '100%', maxWidth: 900, bgcolor: 'rgba(41, 42, 45, 1)', border: '1px solid grey', mt: '10px' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'rgb(227, 227, 227)' }}>
            SEARCHED ITEMS
          </Typography>

          {searchItems.length > 0 ?
            (<>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button onClick={handleSelectAll} variant="contained" sx={{ justifyContent: 'flex-start', color: 'rgb(255, 0, 0)', ml: '10px' }}>
                  select all
                </Button>
                {selectedForDelete.length > 0 ? (
                  <Button onClick={deleteSearch} variant="contained" sx={{ justifyContent: 'end', color: 'rgb(255, 0, 0)', mr: '10px' }}>
                    Delete Selected
                  </Button>
                  
                  
                ) : (null)}
              </Box>
              {searchItems?.map((searchItem) => (
                <Box key={searchItem.id}>
                  <ListItem sx={{ height: '39px' }}>
                    <IconButton onClick={() => toggleCheckBox(searchItem.id)}>
                      {checkSelected.find(item => item.id === searchItem.id)?.selected
                        ? <CheckBoxSharpIcon sx={{ fontSize: '15px', color: 'rgba(230, 230, 230, 0.788)', mr: '10px' }} />
                        : <CheckBoxOutlineBlankSharpIcon sx={{ fontSize: '15px', color: 'rgba(230, 230, 230, 0.788)', mr: '10px' }} />
                      }
                    </IconButton>

                    <Typography sx={{ mr: '30px', color: 'rgba(230, 230, 230, 0.788)' }}>
                      {format(searchItem.searchedAt, 'hh:mm a')}
                    </Typography>
                    <Tooltip title={`click to search ${searchItem.searchTerm}`}>
                      <ListItemButton>
                        <Typography sx={{ color: 'rgb(227, 227, 227)' }}>
                          {searchItem.searchTerm}
                        </Typography>
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                  {/* <Divider sx={{bgcolor:'grey'}} /> */}
                </Box>
              ))}
            </>) : (

              <Typography>
                your search history is empty
              </Typography>)}

        </Box>
      </Box>

      {/* Recently Viewed Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'rgb(227, 227, 227)' }}>
          recentlyViewed
        </Typography>

        <ListingCard items={recentlyViewedItems} handleClickOpen={handleClickOpen}
          button={<RemoveShoppingCartOutlinedIcon sx={{ color: 'rgb(0, 6, 12)' }} />}
        />
      </Box>

      <CustomDialog handleClose={handleClose} selectedItemId={selectedItemId}
        handleDelete={handleDelete} dialog_title="This item will be removed from your recentlyViewed"
        open={open}
      />
    </Box>
  );
};

export default RecentlyViewedItemPage;

