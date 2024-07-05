import React, { useState } from 'react';
import { Box, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton, InputAdornment, Grid, Button } from '@mui/material';
import { TextField, Typography, Divider, Select, InputLabel, MenuItem } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageUploadCard from './image_upload_card';


const MobileAccessoriesSellDetailsPage = () => {
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [itemType, setItemType]=useState('');
  const [errors, setErrors] = useState({});
  const handleItemType = (event) => {
    setItemType(event.target.value);

  };

  const itemTypes=[
    'Power Banks','Chargers', 'Cables', 'Holder & Stands', 'Bags & Cases', 'Others'
  ]

  const validateForm = () => {
    const newErrors = {};
    if (!condition) newErrors.condition = 'Condition is required';
    if(!itemType) newErrors.itemType = 'Select an item type';
    if (!description) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    if (selectedImages.length === 0) newErrors.images = 'At least one image is required';
    
    return newErrors;
  };

  const handleFileChange = (file) => {
    setSelectedImages([...selectedImages, file]);
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      console.log('Form submitted');
    } else {
      setErrors(newErrors);
    }
  };
  const clearItemType = () => {
    setItemType('');
    
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: 'lightgrey',
          margin: 'auto',
          maxWidth: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center the Box content horizontally
          justifyContent: 'center', // Center the Box content vertically
          minHeight: '100vh' // Ensure the Box takes full height of the viewport
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, p: 2, textAlign: 'left', width: '100%' }}>
          Fill in the details
        </Typography>
        <Divider sx={{ width: '100%', height: '1px', bgcolor: 'gray', mb: 2 }} />
        <Box sx={{ width: '70%', margin: 'auto', bgcolor: 'white', p: 2, display: 'flex', flexDirection: 'column' }}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
           
            {/* Item type Dropdown */}

          <FormControl sx={{ m: 1, minWidth: 120 }} error={!!errors.itemType}>
              <InputLabel id="item-type">Item Type</InputLabel>
              <Select
                labelId="item-type"
                value={itemType}
                onChange={handleItemType}
                label="Item Type"
                endAdornment={
                  itemType ? (
                    <InputAdornment position='end'>
                      <IconButton onClick={clearItemType} sx={{ mr: '18px' }}>
                        <CancelIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              >
                {itemTypes.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {errors.itemType && <Typography variant="caption" color="error">{errors.itemType}</Typography>}
            </FormControl>
            
            
            <FormControl error={!!errors.condition}>
              <FormLabel sx={{ textAlign: 'left', mb: 1 }}>
                Condition
              </FormLabel>
              <RadioGroup row sx={{ mb: 3, display: 'flex', flexDirection: 'row' }} value={condition} onChange={(e) => setCondition(e.target.value)}>
                <FormControlLabel value="used" control={<Radio />} label="Used" />
                <FormControlLabel sx={{ ml: '50px' }} value="new" control={<Radio />} label="New" />
              </RadioGroup>
              {errors.condition && <Typography variant="caption" color="error">{errors.condition}</Typography>}
            </FormControl>
            

            {/* DESCRIPTION field */}
            <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'start' }}>
              Description
            </Typography>
            <FormControl sx={{ mb: 6 }} error={!!errors.description}>
              <TextField
                id="description-field"
                multiline
                rows={4}
                placeholder="More details= more interested buyers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <Typography variant="caption" color="error">{errors.description}</Typography>}
            </FormControl>

            {/* PRICE field */}

            <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'start' }}>
              Price(Tk)
            </Typography>
            <FormControl sx={{ mb: 4 }} error={!!errors.price}>
              <TextField
                type='number'
                inputProps={{ min: 0, step: "1", max:200000 }}
                id="price-field"
                placeholder="Pick a good price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                
              />
              {errors.price && <Typography variant="caption" color="error">{errors.price}</Typography>}
            </FormControl>
            <Divider sx={{ mb: 2, width: '100%', height: '1px', bgcolor: 'black' }} />
            <Typography variant="caption" sx={{ mb: 2, textAlign: 'start', fontWeight: 'bold', fontSize: 15 }}>
              Add up to 5 photos
            </Typography>

            <Grid container spacing={1}>
              {[...Array(5)].map((_, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <ImageUploadCard onFileChange={handleFileChange} />
                </Grid>
              ))}
            </Grid>
            {errors.images && <Typography variant="caption" color="error">{errors.images}</Typography>}

            <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>
              Submit
            </Button>
          </DialogContent>
        </Box>
      </Box>
    </>
  );
}

export default MobileAccessoriesSellDetailsPage

