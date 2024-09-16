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
  ListItemButton,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { Toaster, toast } from "sonner";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAuth } from "../context/auth";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom";
const ShowDetailsPage = () => {
  const [item, setItem] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const { itemType, itemId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const fixedColors = ["Red", "Blue", "White", "Black"];
  const [sellerInfo, setSellerInfo] = useState({});
  const navigate = useNavigate();
  const { updateCartSize } = useCart();
  const fetchItem = async () => {
    const res = await axiosPrivate.get(
      `/details/${itemType}/${itemId}`
    );
    setItem(res.data);
  };

  useEffect(() => {
    fetchItem();
  }, [itemId, itemType]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      const res = await axios.get(`https://valo-deal-backend.vercel.app/api/v1/auth/seller-info/${item.sellerId}`)
      setSellerInfo(res.data.seller);
    }
    fetchSellerInfo();
  }, [item.sellerId])

  const handleNavigate = () => {
    navigate('/seller-info', {
      state: {
        phone: `${sellerInfo.phone}`,
        name: `${sellerInfo.name}`, email: `${sellerInfo.email}`, address: `${sellerInfo.address}`
      }
    });
  };
  const handleBuyNow = async () => {
    try {
      const res = await axiosPrivate.post(`/cart/${itemType}/${itemId}`);
      if (res.status === 201) {
        await updateCartSize();
        navigate("/paymentForSingleBuy");
      }

    } catch (error) { //axios take only '200 status' as success and others as error
      if (error.response && error.response.status === 400) {
        navigate("/paymentForSingleBuy",);
      }
      console.log(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axiosPrivate.post(
        `/cart/${itemType}/${itemId}`
      );
      await updateCartSize();
      toast.success("Item added to the cart!");
      console.log('cart')
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
        padding: { xs: "20px", sm: "30px" },
        mt: { xs: "15px", sm: "25px" },
        backgroundColor: "#f5f5f5",
        minHeight: "600px",
      }}
    >
      <Grid container spacing={2} sx={{ height: "auto" }}>
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
                height: { xs: "350px", sm: "550px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
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
                  <div key={index} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src={url}
                      alt={`Product ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
            alignItems: 'flex-start'
          }}
        >
          <Typography variant="h4" sx={{ mb: "20px", color: "orange", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            {item.brand} {item.model}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            Price: ${item.price}
          </Typography>
          <Typography variant="body1" sx={{ mt: "10px", fontSize: { xs: "1rem", sm: "1.2rem" } }}>
            Condition: {item.condition}
          </Typography>
          {item.authenticity && (
            <Typography variant="body1" sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}>
              Authenticity: {item.authenticity}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: "10px", fontSize: { xs: "0.9rem", sm: "1.2rem" } }}>
            Description: {item.description}
          </Typography>
          <Button onClick={handleNavigate} sx={{ paddingLeft: '0', textTransform: 'none', color: 'brown' }} >
            <Person2OutlinedIcon sx={{ color: 'brown' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Seller: {sellerInfo.name}
            </Typography>
          </Button>

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
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              mt: "20px",
              gap: "10px",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                color: "green", height: "50px",
                //width: { xs: "100%", sm: "48%", md: '100%' },
              }}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "skyblue",
                //width: { xs: "100%", sm: "48%", md: '100%' },
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Toaster richColors />
    </Card>

  );
};

export default ShowDetailsPage;