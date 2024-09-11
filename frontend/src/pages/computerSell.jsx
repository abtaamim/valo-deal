import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Card, CardContent, CardMedia, Box, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, IconButton, InputAdornment, Grid, Button } from '@mui/material';
import { TextField, Typography, Divider, Select, InputLabel, MenuItem } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/auth';

import Snackbar from '@mui/material/Snackbar';

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const UploadState = {
  IDLE: 1,
  UPLOADING: 2,
  UPLOADED: 3,
};

Object.freeze(UploadState);
const ComputerSellPage = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  //const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleFileChange = (file) => {
    setSelectedImages([...selectedImages, file]);
  };

  const location = useLocation();
  const { subCategory } = location.state || {};

  const [imgUrl, setImgUrl] = useState("");
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
  async function handleFormData(e) {
    setUploadState(UploadState.UPLOADING);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/upload", {
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
      formData.append('description', description);
      formData.append('price', price);
      formData.append('imgUrl', imgUrl);
      formData.append('subCategory', subCategory);
      formData.append('condition', condition);
      // selectedImages.forEach((image, index) => {
      //   formData.append('images', image, image.name);
      // });
      console.log('Form Data:', Array.from(formData.entries()));
      try {
        const res = await axios.post("http://localhost:8080/sell/computer", formData);
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },

        if (res.status === 200) {
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
            

            {/* BRAND  */}

            <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'start' }}>
              Brand
            </Typography>
            <FormControl sx={{ mb: 4 }} error={!!errors.brand}>
              <TextField
                type='string'
                inputProps={{ min: 0, step: "1", max: 200000 }}
                id="brand-field"
                placeholder="Enter brand name"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              {errors.price && <Typography variant="caption" color="error">{errors.brand}</Typography>}
            </FormControl>

            {/* MODEL DROPDOWN */}

            <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'start' }}>
              Model
            </Typography>
            <FormControl sx={{ mb: 4 }} error={!!errors.model}>
              <TextField
                type='string'
                inputProps={{ min: 0, step: "1", max: 200000 }}
                id="model-field"
                placeholder="Enter model name"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              {errors.price && <Typography variant="caption" color="error">{errors.model}</Typography>}
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

              <Card elevation={3} sx={{ width: 300, textAlign: 'center', height: '50' }}>
                <CardContent>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleFormData}
                  />
                  <label htmlFor="image-upload">
                    <IconButton aria-label="upload picture" component="span">
                      < ImageOutlinedIcon sx={{ fontSize: 28 }} />
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

export default ComputerSellPage;
