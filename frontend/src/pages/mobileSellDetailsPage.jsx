import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Box, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton, InputAdornment, Grid, Button } from '@mui/material';
import { Autocomplete, TextField, Typography, Divider, Select, InputLabel, MenuItem } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/auth';
import gsmarena from 'gsmarena-api';
import Snackbar from '@mui/material/Snackbar';
import { useLocation } from 'react-router-dom';
//const gsmarena = require('gsmarena-api');
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { customAxios, axiosPrivate } from '../api/axiosPrivate';
const UploadState = {
  IDLE: 1,
  UPLOADING: 2,
  UPLOADED: 3,
};

Object.freeze(UploadState);
const MobileSellDetailsPage = () => {
  const [brand, setBrand] = useState('');
  const [product_name, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [authenticity, setAuthenticity] = useState('');
  const [product_description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('')
  const [selectedImages, setSelectedImages] = useState([null, null, null, null, null]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([null, null, null, null, null]);
  const [brandId, setBrandId] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { subCategoryId, subCategoryName } = location.state || {};
  const handleBrand = (event) => {
    const selectedBrandName = event.target.value;
    setBrand(selectedBrandName);
    setModel('');


    const selectedBrand = gsmBrandName.find(brand => brand.name === selectedBrandName);
    // console.log(selectedBrandName);
    if (selectedBrand) {
      setBrandId(selectedBrand.id);
    }
  };


  const handleModel = (event, value) => {
    //setModel(event.target.value);
    setModel(value);
  };

  const clearBrand = () => {
    setBrand('');
    setModel('');
  };

  const clearModel = () => {
    setModel('');
  };

  const [gsmBrandName, setGsmBrandName] = useState([{ name: null, id: null }])
  const [gsmModelName, setGsmModelName] = useState([]);
  const getgsmBrand = async () => {
    try {
      const res = await axiosPrivate.get("/sell/gsmbrand")
      const brands = res.data.brands;
      // console.log(res.data.brands);

      setGsmBrandName(brands.map(brand => ({ name: brand.name, id: brand.id })))

    } catch (error) {
      // console.log("Error gsm: ", error);
    }
  }
  useEffect(() => {
    // getgsmBrand();
    // console.log(gsmBrandName);
  }, [])
  const getgsmModel = async () => {
    try {
      const res = await customAxios.get(`/sell/gsmmodel/${brandId}`)
      const models = res.data.models;
      // console.log(res.data.models);
      setGsmModelName(models.map(product_name => (product_name.name)));
    } catch (error) {
      //  console.log("Error gsm product_name: ", error);
    }
  }
  useEffect(() => {
    if (brandId) {
      // getgsmModel();
    }

  }, [brand])
  const handleBrandChange = (event, value) => {
    setBrand(value);
    setModel('');

    const selectedBrand = gsmBrandName.find(brand => brand.name === value);
    if (selectedBrand) {
      setBrandId(selectedBrand.id);
      //getgsmModel(selectedBrand.id);
    }
  }
  // useEffect(() => {

  // }, [gsmBrandName]);
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedImages([file]);
  //     setImagePreviewUrl(URL.createObjectURL(file));
  //   }
  // };
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newSelectedImages = [...selectedImages];
      const newImagePreviewUrls = [...imagePreviewUrl];

      newSelectedImages[index] = file;
      newImagePreviewUrls[index] = URL.createObjectURL(file);

      setSelectedImages(newSelectedImages);
      setImagePreviewUrl(newImagePreviewUrls);
    }
  };
  const [imgUrl, setImgUrl] = useState("");
  const [uploadState, setUploadState] = useState(UploadState.IDLE);

  async function handleFormData(file) {
    setUploadState(UploadState.UPLOADING);
    // const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post("/upload", formData);

      const data = await res.data;
      setImgUrl(data.secure_url);
      // console.log(imgUrl)
      setUploadState(UploadState.UPLOADED);
      return data.secure_url;
    } catch (error) {
      // console.log(imgUrl)
      console.error("Error uploading file:", error);
      setUploadState(UploadState.IDLE); // reset to IDLE state in case of an error
    }
    //here***

  }

  const handleMultipleImageUploads = async () => {
    const uploadedImageUrls = [];

    for (let i = 0; i < selectedImages.length && selectedImages[i]!= null; i++) {
      const imageUrl = await handleFormData(selectedImages[i]);
      if (imageUrl) {
        uploadedImageUrls.push(imageUrl);
      }
    }
    //  console.log('All uploaded image URLs:', uploadedImageUrls);
    return uploadedImageUrls;

  };


  const validateForm = () => {
    const newErrors = {};
    if (!condition) newErrors.condition = 'Condition is required';

    if (!brand) newErrors.brand = 'Brand is required';
    if (!product_name) newErrors.product_name = 'Model is required';
    if (!product_description) newErrors.product_description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';

    const checkImage = selectedImages.filter(img => (img !== null))
    if (checkImage.length < 3) newErrors.images = 'At least three image is required';


    return newErrors;
  };

  const [auth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        const imageUrl = await handleMultipleImageUploads();
        const formData = new FormData();
        //  formData.append('sellerId', auth.user._id);
        //  formData.append('brand', brand);
        //  formData.append('product_name', product_name);
        //  formData.append('condition', condition);
        //  formData.append('authenticity', authenticity);
        // //  change
        //  formData.append('product_description', product_description);
        //  formData.append('price', price);
        //  imageUrl.forEach((img, index) => {
        //    formData.append(`imgUrl[${index}]`, img);
        //  });

        formData.append('brand', brand);
        formData.append('product_name', product_name);
        formData.append('category_id', subCategoryId);
        formData.append('condition', condition);
        formData.append('product_description', product_description);
        formData.append('price', price);
        formData.append('stock', stock);
        imageUrl.forEach((img, index) => {
          formData.append(`img_urls[${index}]`, img);
        });
        //  console.log('Form Data:', Array.from(formData.entries()));
        //  product_name,
        //  product_description,
        //  brand,
        //  category_id,
        //  price,
        //  stock,
        //  condition,
        //  img_urls
        //  const res = await axiosPrivate.post("/sell/mobile", formData);
        const res = await axiosPrivate.post("/product/create", formData);
        if (res.status === 200) {
          //    console.log('Product uploaded successfully');
          setAlertMessage('Product uploaded successfully');
          setSubmissionSuccess(true);
          navigate("/added-items");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error uploading product:", error);
      } finally {
        setLoading(false); // Stop loading after request completes
      }
    } else {
      setErrors(newErrors);
      setLoading(false); // Stop loading if validation fails
    }
  };


  // useEffect(() => {
  //   if (submissionSuccess) {
  //     const timer = setTimeout(() => {
  //       navigate("/added-items");
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [submissionSuccess, navigate]);

  // const brands_models = {
  //   samsung: ["Galaxy S23 Ultra", "Galaxy S23+", "Galaxy A54 5G", "Galaxy Z Fold 4", "Galaxy Z Flip 4"],
  //   iphone: ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone SE (2022)"],
  //   xiaomi: ["13 Pro", "13", "12T Pro", "12T", "Redmi Note 12 Pro"],
  //   realme: ["GT Neo 5", "10 Pro+", "10 Pro", "10", "Narzo 50"],
  //   vivo: ["X90 Pro+", "X90 Pro", "V27 Pro", "V27", "Y56"],
  //   oppo: ["Find X6 Pro", "Find X6", "Reno 9 Pro+", "Reno 9 Pro", "A98"],
  //   nothingphone: ["Phone (1)"],
  //   google: ["Pixel 7 Pro", "Pixel 7", "Pixel 6a"],
  //   oneplus: ["11", "10 Pro", "Nord 2T"],
  //   motorola: ["Edge 40 Pro", "Edge 30 Fusion", "Moto G Stylus 5G (2023)"],
  //   sony: ["Xperia 1 V", "Xperia 5 IV", "Xperia 10 IV"],
  //   asus: ["ROG Phone 7", "Zenfone 10", "ROG Phone 6"]
  // };

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
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
        <Box
          sx={{
            bgcolor: 'white',
            //margin: 'auto',

            //alignSelf: 'center',
            maxWidth: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center the Box content horizontally
            justifyContent: 'center', // Center the Box content vertically
            minHeight: '100vh', // Ensure the Box takes full height of the viewport

          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, p: 2, textAlign: 'left', width: '100%' }}>
            Fill in the details
          </Typography>
          <Divider sx={{ width: '100%', height: '1px', bgcolor: 'gray' }} />
          <Box sx={{ width: '100%', bgcolor: 'white', p: 1, display: 'flex', flexDirection: 'column' }}>
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
              {/* <FormControl error={!!errors.authenticity}>
                <FormLabel sx={{ textAlign: 'left', mb: 1 }}>
                  Authenticity
                </FormLabel>
                <RadioGroup row value={authenticity} onChange={(e) => setAuthenticity(e.target.value)}>
                  <FormControlLabel value="Original" control={<Radio />} label="Original" />
                  <FormControlLabel sx={{ ml: '35px' }} value="Refurbished" control={<Radio />} label="Refurbished" />
                </RadioGroup>
                {errors.authenticity && <Typography variant="caption" color="error">{errors.authenticity}</Typography>}
              </FormControl> */}

              {/* BRAND DROPDOWN */}

              <FormControl sx={{ m: 1, minWidth: 120 }} error={!!errors.brand}>

                <TextField
                  id="brand-field"
                  
                  placeholder="brand name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
  

                {/* <Autocomplete
                  options={gsmBrandName.map(brand => brand.name)}
                  value={brand}
                  onChange={handleBrandChange}
                  isOptionEqualToValue={(option, value) => option === value}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Brand"
                      variant="outlined"
                      error={!!errors.brand}

                    />
                  )}
                /> */}
                {/* <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                labelId="brand-select-label"
                value={brand}
                onChange={handleBrand}
                label="Model"
                endAdornment={
                  product_name ? (
                    <InputAdornment position='end'>
                      <IconButton onClick={clearBrand} sx={{ mr: '18px' }}>
                        <CancelIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250,
                    },
                  },
                }}
              >
                {gsmBrandName.map((brand) => (
                  <MenuItem key={brand.name} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select> */}
                {errors.brand && <Typography variant="caption" color="error">{errors.brand}</Typography>}
              </FormControl>


              {/* MODEL DROPDOWN */}

              <FormControl sx={{ m: 1, minWidth: 120, mb: 8 }} disabled={!brand} error={!!errors.product_name}>
                {/* <InputLabel id="product_name-select-label">Model</InputLabel>
              <Select
                labelId="product_name-select-label"
                value={product_name}
                onChange={handleModel}
                label="Model"
                endAdornment={
                  product_name ? (
                    <InputAdornment position='end'>
                      <IconButton onClick={clearModel} sx={{ mr: '18px' }}>
                        <CancelIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250,
                    },
                  },
                }}
              >
                {brand && gsmModelName?.map((modelName) => (
                  <MenuItem key={modelName} value={modelName}>
                    {modelName}
                  </MenuItem>
                ))}
              </Select> */}
                {/* <Autocomplete
                  options={gsmModelName.map(product_name => product_name)}
                  value={product_name}
                  onChange={handleModel}
                  disabled={!brand}
                  //sx={{height:'250px'}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Model"
                      variant="outlined"
                      error={!!errors.product_name}

                    />
                  )}
                /> */}
                <TextField
                  id="model-field"

                  placeholder="model name"
                  value={product_name}
                  onChange={(e) => setModel(e.target.value)}
                />
                {errors.product_name && <Typography variant="caption" color="error">{errors.product_name}</Typography>}
              </FormControl>

              {/* DESCRIPTION field */}
              <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'start' }}>
                Description
              </Typography>
              <FormControl sx={{ mb: 6 }} error={!!errors.product_description}>
                <TextField
                  id="product_description-field"
                  multiline
                  rows={4}
                  placeholder="More details= more interested buyers"
                  value={product_description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.product_description && <Typography variant="caption" color="error">{errors.product_description}</Typography>}
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

              {/* STOCK field */}
              <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'start' }}>
                Stock
              </Typography>
              <FormControl sx={{ mb: 4 }} error={!!errors.price}>
                <TextField
                  type='number'
                  inputProps={{ min: 1, step: "1", max: 5000 }}
                  id="stock-field"
                  // placeholder="Pick a good price"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errors.price && <Typography variant="caption" color="error">{errors.price}</Typography>}
              </FormControl>
              <Divider sx={{ mb: 2, width: '100%', height: '1px', bgcolor: 'black' }} />
              <Typography variant="caption" sx={{ mb: 2, textAlign: 'start', fontWeight: 'bold', fontSize: 15 }}>
                Add up to 5 photos
              </Typography>
              <FormControl error={!!errors.images} >
                <Grid container spacing={1}>
                  {selectedImages.map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card elevation={3} sx={{ textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardContent>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`image-upload-${index}`}
                            type="file"
                            onChange={(event) => handleFileChange(index, event)}
                          />
                          <label htmlFor={`image-upload-${index}`}>
                            <IconButton aria-label="upload picture" component="span">
                              <ImageOutlinedIcon sx={{ fontSize: 28 }} />
                            </IconButton>
                          </label>

                          {imagePreviewUrl[index] ? (
                            <CardMedia
                              component="img"
                              height="140"
                              image={imagePreviewUrl[index]}
                              alt={`Uploaded image ${index + 1}`}
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              {selectedImages[index] ? "Image Selected" : "Add Image"}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {/* </Box> */}
                </Grid>
                {errors.images && <Typography variant="caption" color="error">{errors.images}</Typography>}
              </FormControl>
              <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Uploading...' : 'Submit'}
              </Button>

            </DialogContent>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default MobileSellDetailsPage;