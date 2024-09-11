import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAuth } from "../context/auth"; // Import the auth context

const ShowDetailsPage = () => {
  const [item, setItem] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const { itemType, itemId } = useParams();
  const { auth } = useAuth(); // Access auth context

  // Define the fixed colors array
  const fixedColors = ["Red", "Blue", "White", "Black"];

  const fetchItem = async () => {
    const res = await axios.get(
      `http://localhost:8080/details/${itemType}/${itemId}`
    );
    setItem(res.data);
  };

  useEffect(() => {
    fetchItem();
  }, [itemId, itemType]);

  const handleBuyNow = () => {
    // Logic for "Buy Now" button
    console.log("Buy Now clicked");
  };

  const handleAddToCart = async () => {
    try {
      const token = auth?.token;
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:8080/cart/add",
        {
          productId: itemId,
          productType: itemType,
          color: selectedColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Item added to cart successfully");
        // Optionally, you can display a toast notification here
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: "auto",
        padding: "20px",
        mt: "20px",
        backgroundColor: "#f5f5f5",
        height: "100vh",
      }}
    >
      <Grid container spacing={4} sx={{ height: "100%" }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.imgUrl && item.imgUrl.length > 0 && (
            <Box
              sx={{
                width: "100%",
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={3000}
                dynamicHeight={false}
                sx={{ width: "100%", height: "100%" }}
              >
                {item.imgUrl.map((url, index) => (
                  <div key={index}>
                    <img
                      src={url}
                      alt="Product"
                      style={{
                        width: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </Box>
          )}
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: "20px", color: "orange" }}>
            {item.brand} {item.model}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
            Price: ${item.price}
          </Typography>
          <Typography variant="body1" sx={{ mt: "10px", fontSize: "1.2rem" }}>
            Condition: {item.condition}
          </Typography>
          {item.authenticity && (
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
              Authenticity: {item.authenticity}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: "10px", fontSize: "1.2rem" }}>
            Description:{item.description}
          </Typography>

          <FormControl fullWidth sx={{ mt: "20px" }}>
            <InputLabel id="color-select-label">Select Color</InputLabel>
            <Select
              labelId="color-select-label"
              id="color-select"
              value={selectedColor}
              label="Select Color"
              onChange={handleColorChange}
            >
              {fixedColors.map((color, index) => (
                <MenuItem key={index} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "20px",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "green", width: "100%" }} // Adjust the button width here
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            {/* <Button variant="contained" sx={{ backgroundColor: 'orange' }} onClick={handleAddToCart}>
              Add to Cart
            </Button> */}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ShowDetailsPage;
