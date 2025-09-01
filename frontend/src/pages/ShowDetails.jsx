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
import { useCart } from "../context/CartContext";
import { Toaster, toast } from "sonner";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAuth } from "../context/auth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { customAxios } from "../api/axiosPrivate";
const ShowDetailsPage = () => {
  const [item, setItem] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const { itemId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [sellerInfo, setSellerInfo] = useState({});
  const navigate = useNavigate();
  const { updateCartSize } = useCart();
  const location = useLocation();
  const { prevUrl } = location.state || '';
  const fetchItem = async () => {
    const res = await customAxios.get(`/product/${itemId}`);
    setItem(res.data);
  };

  useEffect(() => {
    fetchItem();
  //  console.log(prevUrl);
  }, [itemId]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (item.sellerId) {
        const res = await axios.get(
          `https://valo-deal-backend.vercel.app/api/v1/auth/seller-info/${item.seller_id.id}`
        );
        setSellerInfo(res.data.seller);
      }
    };
    fetchSellerInfo();

  }, [item.seller_id?.id]);

  const handleNavigate = () => {
    navigate("/seller-info", {
      state: {
        phone: `${sellerInfo.phone}`,
        name: `${sellerInfo.name}`,
        email: `${sellerInfo.email}`,
        address: `${sellerInfo.address}`,
        id: item.sellerId
      },
    });
  };


  const handleBuyNow = () => {
    navigate("/single-item-payment", { state: { item } });

  };

   const handleAddToCart = async (itemId) => {
     try {
       const res = await axiosPrivate.post(`/cart/${itemId}`);
       await updateCartSize();
       toast.success(
         <div onClick={() => navigate("/cart")}>
           Item added to the cart! Click here to view your cart.
         </div>,
         { position: "bottom-right", autoClose: false }
       );
 
     } catch (error) {
       toast.error(`${error.response.data.message}`, { position: "bottom-right" });
       console.error(`Error adding to cart ${itemType}:`, error);
     }
   };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  // Format price for Bangladeshi Taka
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
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
          {item.img_urls && item.img_urls.length > 0 && (
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
                {item.img_urls.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h4" sx={{ mb: "20px", color: "orange", fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            {item.brand} {item.model}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            Price: {formatPrice(item.price)}
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
            Description: {item.product_description}
          </Typography>
          <Button onClick={handleNavigate} sx={{ paddingLeft: "0", textTransform: "none", color: "brown" }}>
            <Person2OutlinedIcon sx={{ color: "brown" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Seller: {item.seller_id?.name}
            </Typography>
          </Button>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              mt: '20px',
              gap: '10px',
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
            {prevUrl !== '/cart' ?
              <Button
                variant="contained"
                sx={{

                  backgroundColor: "skyblue",
                  //width: { xs: "100%", sm: "48%", md: '100%' },

                }}
                onClick={()=>{handleAddToCart(item._id)}}
              >
                Add to Cart
              </Button>
              : null
            }
          </Box>

        </Grid>
      </Grid>
      <Toaster richColors />
    </Card>
  );
};

export default ShowDetailsPage;
