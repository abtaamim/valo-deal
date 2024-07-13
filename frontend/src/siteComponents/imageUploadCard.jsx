import React, { useState } from 'react';
import { Box, Card, CardMedia, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const ImageUploadCard = ({ onFileChange }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file); // Pass the selected file to the parent component
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onFileChange(null); // Clear the selected file in the parent component
  };

  return (
    <Card sx={{ position: 'relative' }}>
      {preview ? (
        <Box>
          <CardMedia
            component="img"
            image={preview}
            sx={{ width: '100%', height: '150px', objectFit: 'cover' }}
          
          />
          <IconButton
            sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'white' }}
            onClick={handleRemoveImage}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '150px',
            border: '2px dashed grey',
            cursor: 'pointer'
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleImageChange}
            name='image'
          />
          <label htmlFor="file-upload">
            <Box component="span" sx={{ color: 'grey' }}>
              Upload Image
            </Box>
          </label>
        </Box>
      )}
    </Card>
  );
};

export default ImageUploadCard;
