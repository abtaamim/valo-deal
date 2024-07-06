import React, { useState, useEffect } from 'react';
import { Box, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton, InputAdornment, Grid, Button } from '@mui/material';
import { TextField, Typography, Divider, Select, InputLabel, MenuItem } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/auth';
import Snackbar from '@mui/material/Snackbar';
import toast from "react-hot-toast";
import phn1 from '/public/assets/images/phn1.jpg'
import phn2 from '/public/assets/images/phn2.jpg'
import phn3 from '/public/assets/images/phn3.jpg';

const MobileSellDetailsPage = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [authenticity, setAuthenticity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const predefinedImages = [phn1, phn2, phn3];
  const [selectedImage, setSelectedImage] = useState(predefinedImages[Math.floor(Math.random() * predefinedImages.length)]);

  const handleBrand = (event) => {
    setBrand(event.target.value);
    setModel('');
  };

  const handleModel = (event) => {
    setModel(event.target.value);
  };

  const clearBrand = () => {
    setBrand('');
    setModel('');
  };

  const clearModel = () => {
    setModel('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!condition) newErrors.condition = 'Condition is required';
    if (!authenticity) newErrors.authenticity = 'Authenticity is required';
    if (!brand) newErrors.brand = 'Brand is required';
    if (!model) newErrors.model = 'Model is required';
    if (!description) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    return newErrors;
  };

  const [auth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append('sellerId', auth.user._id);
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('condition', condition);
      formData.append('authenticity', authenticity);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('images', selectedImage);

      try {
        const res = await axios.post("https://valo-deal-backend.vercel.app/api/v1/sell/mobiles", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res.status === 200) {
          setAlertMessage('Product uploaded successfully');
          setSubmissionSuccess(true);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Registration Error:", error.response ? error.response.data : error.message);
        toast.error("Something went wrong");
      }
    } else {
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (submissionSuccess) {
      const timer = setTimeout(() => {
        navigate("/added-items");
      }, 2000); 

      return () => clearTimeout(timer); 
    }
  }, [submissionSuccess, navigate]);

  const brands_models = {
    samsung: ["Galaxy S23 Ultra", "Galaxy S23+", "Galaxy A54 5G", "Galaxy Z Fold 4", "Galaxy Z Flip 4"],
    iphone: ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone SE (2022)"],
    xiaomi: ["13 Pro", "13", "12T Pro", "12T", "Redmi Note 12 Pro"],
    realme: ["GT Neo 5", "10 Pro+", "10 Pro", "10", "Narzo 50"],
    vivo: ["X90 Pro+", "X90 Pro", "V27 Pro", "V27", "Y56"],
    oppo: ["Find X6 Pro", "Find X6", "Reno 9 Pro+", "Reno 9 Pro", "A98"],
    nothingphone: ["Phone (1)"],
    google: ["Pixel 7 Pro", "Pixel 7", "Pixel 6a"],
    oneplus: ["11", "10 Pro", "Nord 2T"],
    motorola: ["Edge 40 Pro", "Edge 30 Fusion", "Moto G Stylus 5G (2023)"],
    sony: ["Xperia 1 V", "Xperia 5 IV", "Xperia 10 IV"],
    asus: ["ROG Phone 7", "Zenfone 10", "ROG Phone 6"]
  };

  const handleClose = () => {
    setSubmissionSuccess(false)
  };

  return (
    <>
      {alertMessage && (
        <Snackbar
          open={submissionSuccess}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Product uploaded successfully"
        />
      )}
      <Box
        sx={{
          bgcolor: 'lightgrey',
          margin: 'auto',
          maxWidth: 800,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, p: 2, textAlign: 'left', width: '100%' }}>
          Fill in the details
        </Typography>
        <Divider sx={{ width: '100%', height: '1px', bgcolor: 'gray', mb: 2 }} />
        <Box sx={{ width: '70%', margin: 'auto', bgcolor: 'white', p: 2, display: 'flex', flexDirection: 'column' }}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
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
            <FormControl error={!!errors.authenticity}>
              <FormLabel sx={{ textAlign: 'left', mb: 1 }}>
                Authenticity
              </FormLabel>
              <RadioGroup row value={authenticity} onChange={(e) => setAuthenticity(e.target.value)}>
                <FormControlLabel value="Original" control={<Radio />} label="Original" />
                <FormControlLabel sx={{ ml: '35px' }} value="Refurbished" control={<Radio />} label="Refurbished" />
              </RadioGroup>
              {errors.authenticity && <Typography variant="caption" color="error">{errors.authenticity}</Typography>}
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} error={!!errors.brand}>
              <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                labelId="brand-select-label"
                value={brand}
                onChange={handleBrand}
                label="Brand"
                endAdornment={
                  brand ? (
                    <InputAdornment position='end'>
                      <IconButton onClick={clearBrand} sx={{ mr: '18px' }}>
                        <CancelIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              >
                {Object.keys(brands_models).map((brandName) => (
                  <MenuItem key={brandName} value={brandName}>
                    {brandName}
                  </MenuItem>
                ))}
              </Select>
              {errors.brand && <Typography variant="caption" color="error">{errors.brand}</Typography>}
            </FormControl>

            {brand && (
              <FormControl sx={{ m: 1, minWidth: 120 }} error={!!errors.model}>
                <InputLabel id="model-select-label">Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  value={model}
                  onChange={handleModel}
                  label="Model"
                  endAdornment={
                    model ? (
                      <InputAdornment position='end'>
                        <IconButton onClick={clearModel} sx={{ mr: '18px' }}>
                          <CancelIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                >
                  {brands_models[brand].map((modelName) => (
                    <MenuItem key={modelName} value={modelName}>
                      {modelName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.model && <Typography variant="caption" color="error">{errors.model}</Typography>}
              </FormControl>
            )}

            <TextField
              id="description"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mt: 2 }}
            />

            <TextField
              id="price"
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
              sx={{ mt: 2 }}
            />

            <Button variant='contained' color="success" onClick={handleSubmit} sx={{ mt: 2 }}>
              Upload
            </Button>
          </DialogContent>
        </Box>
      </Box>
    </>
  );
};

export default MobileSellDetailsPage;
