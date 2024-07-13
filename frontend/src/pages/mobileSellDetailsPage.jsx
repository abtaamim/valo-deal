import React, { useState, useEffect } from 'react';
import {Card,CardContent, CardMedia, Box, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton, InputAdornment, Grid, Button } from '@mui/material';
import { TextField, Typography, Divider, Select, InputLabel, MenuItem } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageUploadCard from './image_upload_card';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/auth';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { CleaningServices } from '@mui/icons-material';
import NewImageUploadCard from '../siteComponents/newImage';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const UploadState = {
    IDLE: 1,
    UPLOADING: 2,
    UPLOADED: 3,
};

Object.freeze(UploadState);
const MobileSellDetailsPage = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [authenticity, setAuthenticity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  //const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

  const handleFileChange = (file) => {
    setSelectedImages([...selectedImages, file]);
  };

  const [imgUrl, setImgUrl] = useState("");
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  async function handleFormData(e) {
      setUploadState(UploadState.UPLOADING);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
          const res = await fetch("https://valo-deal-backend.vercel.app/upload", {
              method: "POST",
              body: formData,
          });
          const data = await res.json();
          setImgUrl(data.secure_url);
          console.log(imgUrl)
          setUploadState(UploadState.UPLOADED);
      } catch (error) {
        console.log(imgUrl)
          console.error("Error uploading file:", error);
         setUploadState(UploadState.IDLE); // reset to IDLE state in case of an error
      }
  }


  const validateForm = () => {
    const newErrors = {};
    if (!condition) newErrors.condition = 'Condition is required';
    if (!authenticity) newErrors.authenticity = 'Authenticity is required';
    if (!brand) newErrors.brand = 'Brand is required';
    if (!model) newErrors.model = 'Model is required';
    if (!description) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    //if (selectedImages.length === 0) newErrors.images = 'At least one image is required';
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
      formData.append('imgUrl', imgUrl);
      // selectedImages.forEach((image, index) => {
      //   formData.append('images', image, image.name);
      // });
      console.log('Form Data:', Array.from(formData.entries()));
      try {
        const res = await axios.post("https://valo-deal-backend.vercel.app/sell/mobile", formData); 
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        
        if (res.status===200) {
          console.log('yayayay')
          setAlertMessage('Product uploaded successfully');
          setSubmissionSuccess(true);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        console.error("Registration Error:", error.response ? error.response.data : error.message);
      //  toast.error("Something went wrong");
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

            {/* BRAND DROPDOWN */}

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

            {/* MODEL DROPDOWN */}

            <FormControl sx={{ m: 1, minWidth: 120, mb: 8 }} disabled={!brand} error={!!errors.model}>
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
                {brand && brands_models[brand].map((modelName) => (
                  <MenuItem key={modelName} value={modelName}>
                    {modelName}
                  </MenuItem>
                ))}
              </Select>
              {errors.model && <Typography variant="caption" color="error">{errors.model}</Typography>}
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
                inputProps={{ min: 0, step: "1", max: 200000 }}
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
             {/*  {[...Array(5)].map((_, index) => ( */}
                {/* <Grid item xs={6} sm={4} md={3} key={index}>
                  <ImageUploadCard onFileChange={handleFileChange} />
                </Grid> */}
              {/* ))} */}
              {/* <div className="flex justify-center h-screen items-center">
            {uploadState !== UploadState.UPLOADED ? (
                <div className="w-32">
                    <label
                        htmlFor="image"
                        className="block bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
                    >
                        {uploadState === UploadState.UPLOADING ? (
                            <span>Uploading...</span>
                        ) : (
                            <span>Upload</span>
                        )}
                        <input
                            type="file"
                            name="file"
                            id="image"
                            className="hidden"
                            onChange={handleFormData}
                        />
                    </label>
                </div>
            ) : (
                <div className="w-96 text-green-500">
                    <span className="block py-2 px-3 text-green-500 text-center">
                        Uploaded!
                    </span>
                    <img className="w-full" src={imgUrl} alt="Uploaded image" />
                </div>
            )}
        </div> */}
{/* <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                Upload Images
              </Typography>
              <NewImageUploadCard  handleImageChange={handleFormData} preview={imgUrl} />
              {errors.images && <Typography variant="caption" color="error">{errors.images}</Typography>} */}
               {/* <Box display="flex" justifyContent="center" alignItems="center" height="100px" bgcolor="#f5f5f5"> */}
            <Card elevation={3} sx={{ width: 300, textAlign: 'center',height:'50' }}>
                <CardContent>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        type="file"
                        onChange={handleFormData}
                    />
                    <label htmlFor="image-upload">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
                        </IconButton>
                    </label>
                    {imgUrl ? (
                        <CardMedia
                            component="img"
                            height="200"
                            image={imgUrl}
                            alt="Uploaded image"
                        />
                    ) : (
                        <Typography variant="h6" color="textSecondary">
                            {uploadState === 'UPLOADING' ? 'Uploading...' : 'Add Image'}
                        </Typography>
                    )}
                </CardContent>
                {imgUrl && (
                    <CardContent>
                        {/* <Typography variant="h6" color="green">
                            Uploaded!
                        </Typography> */}
                    </CardContent>
                )}
            </Card>
        {/* </Box> */}
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

export default MobileSellDetailsPage;