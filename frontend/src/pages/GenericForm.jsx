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
import useAxiosPrivate from '../hooks/useAxiosPrivate';
const UploadState = {
  IDLE: 1,
  UPLOADING: 2,
  UPLOADED: 3,
};

Object.freeze(UploadState);

const GenericForm = ({ category, endpoint }) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [uploadState, setUploadState] = useState(UploadState.IDLE);
const [isUploading, setIsUploading] = useState(false); // New state for tracking upload status

  const [imagePreviewUrl, setImagePreviewUrl] = useState([null, null, null, null, null]);
  const [selectedImages, setSelectedImages] = useState([null, null, null, null, null]);

  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const { subCategory } = location.state || {};

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

  async function handleFormData(file) {
    setUploadState(UploadState.UPLOADING);
    // const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post("/upload", formData);
      const data = await res.data;
      setImgUrl(data.secure_url);
      setUploadState(UploadState.UPLOADED);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadState(UploadState.IDLE); // reset to IDLE state in case of an error
    }
  }
  const handleMultipleImageUploads = async () => {
    const uploadedImageUrls = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const imageUrl = await handleFormData(selectedImages[i]);
      if (imageUrl) {
        uploadedImageUrls.push(imageUrl);
      }
    }
    //console.log('All uploaded image URLs:', uploadedImageUrls);
    return uploadedImageUrls;

  };
  const validateForm = () => {
    const newErrors = {};
    if (!brand) newErrors.brand = 'Brand is required';
    if (!model) newErrors.model = 'Model is required';
    if (!description) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';

    const checkImage = selectedImages.filter(img => (img !== null))
    if (checkImage.length < 3) newErrors.images = 'At least three image is required';

    return newErrors;
  };

  const [auth] = useAuth();
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();
  if (Object.keys(newErrors).length === 0) {
    setIsUploading(true); // Set uploading state to true
    try {
      const imageUrl = await handleMultipleImageUploads();

      const formData = new FormData();
      formData.append('sellerId', auth.user._id);
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('subCategory', subCategory);
      formData.append('condition', condition);
      imageUrl.forEach((img, index) => {
        formData.append(`imgUrl[${index}]`, img);
      });

      const res = await axiosPrivate.post(`/sell/${endpoint}`, formData);
      if (res.status === 200) {
        setAlertMessage('Product uploaded successfully');
        setSubmissionSuccess(true);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error("Registration Error:", error.response ? error.response.data : error.message);
    } finally {
      setIsUploading(false); // Reset uploading state after completion
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
              {errors.brand && <Typography variant="caption" color="error">{errors.brand}</Typography>}
            </FormControl>

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
              {errors.model && <Typography variant="caption" color="error">{errors.model}</Typography>}
            </FormControl>

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

              </Grid>
              {errors.images && <Typography variant="caption" color="error">{errors.images}</Typography>}
            </FormControl>
            <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Submit'}
            </Button>
            
          </DialogContent>
        </Box>
      </Box>
    </>
  );
};

export default GenericForm;
