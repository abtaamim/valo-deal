import { useRef, useState } from "react";
import { ButtonBase, Card, CardContent, IconButton, Typography } from "@mui/material";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const ImageUploadCard = ({ onFileChange }) => {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      onFileChange(file);
      inputRef.current.value = ''; // Clear the input value
    }
  };

  return (
    <ButtonBase onClick={handleImageClick} >
      <Card variant="outlined" sx={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent style={{ textAlign: 'center', padding: 6 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            type="file"
            onChange={handleImageChange}
            ref={inputRef}
          />
          {image ? (
            <img src={URL.createObjectURL(image)} alt="" style={{ width: '100%', height: 'auto', maxHeight: '150px' }} />
          ) : (
            <>
              <IconButton>
                <ImageOutlinedIcon />
              </IconButton>
              <Typography variant="body1">Click to upload</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </ButtonBase>
  );
};

export default ImageUploadCard;
