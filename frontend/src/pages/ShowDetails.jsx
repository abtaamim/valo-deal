import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Chip,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { Toaster, toast } from "sonner";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useAuth } from "../context/auth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { customAxios } from "../api/axiosPrivate";

const ShowDetailsPage = () => {
  const [item, setItem] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoomPreview, setShowZoomPreview] = useState(false);
  const { itemId } = useParams();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [sellerInfo, setSellerInfo] = useState({});
  const navigate = useNavigate();
  const { updateCartSize } = useCart();
  const location = useLocation();
  const { prevUrl } = location.state || {};
  const imageContainerRef = useRef(null);

  const fetchItem = async () => {
    try {
      const res = await customAxios.get(`/product/${itemId}`);
      setItem(res.data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (item.seller_id?._id) {
        try {
          const res = await axios.get(
            `https://valo-deal-backend.vercel.app/api/v1/auth/seller-info/${item.seller_id._id}`
          );
          setSellerInfo(res.data.seller);
        } catch (error) {
          console.error("Error fetching seller info:", error);
        }
      }
    };
    fetchSellerInfo();
  }, [item.seller_id?._id]);

  const handleNavigate = () => {
    navigate("/seller-info", {
      state: {
        phone: sellerInfo.phone,
        name: sellerInfo.name,
        email: sellerInfo.email,
        address: sellerInfo.address,
        id: item.seller_id?._id,
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
      toast.error(`${error.response?.data?.message || "Failed to add to cart"}`, {
        position: "bottom-right",
      });
      console.error("Error adding to cart:", error);
    }
  };

  const handleImageHover = (e) => {
    if (!imageContainerRef.current) return;
    
    const container = imageContainerRef.current;
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
    setShowZoomPreview(true);
  };

  const handleZoomClick = () => {
    setIsZoomed(!isZoomed);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        maxWidth: "100%",
        margin: "auto",
        padding: { xs: "15px", sm: "25px" },
        mt: { xs: "10px", sm: "20px" },
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        minHeight: "800px",
      }}
    >
      <IconButton
        onClick={() => navigate(prevUrl || -1)}
        sx={{ mb: 2, color: "text.primary" }}
      >
        <ArrowBackIosNewOutlinedIcon />
        <Typography variant="body2" sx={{ ml: 1 }}>
          Back
        </Typography>
      </IconButton>
      <Grid container spacing={3}>
        {/* Image Gallery with Advanced Zoom */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: { xs: "350px", sm: "500px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            {/* Main Image with Zoom */}
            <Box
              ref={imageContainerRef}
              onMouseMove={handleImageHover}
              onMouseEnter={() => setShowZoomPreview(true)}
              onMouseLeave={() => setShowZoomPreview(false)}
              onClick={handleZoomClick}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isZoomed ? "zoom-out" : "zoom-in",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {item.img_urls && item.img_urls.length > 0 && (
                <>
                  <img
                    src={item.img_urls[currentImageIndex]}
                    alt={`Product ${currentImageIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transform: isZoomed ? "scale(2)" : "scale(1)",
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      transition: isZoomed ? "transform 0.3s ease" : "none",
                    }}
                  />
                  
                  {/* Zoom Preview (Lens Effect) */}
                  {showZoomPreview && !isZoomed && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${item.img_urls[currentImageIndex]})`,
                        backgroundSize: "200%",
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundRepeat: "no-repeat",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  
                  {/* Zoom Indicator */}
                  {!isZoomed && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "16px",
                        right: "16px",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        },
                      }}
                    >
                      <ZoomInIcon />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
          
          {/* Thumbnail Gallery */}
          {item.img_urls && item.img_urls.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
                width: "100%",
                overflowX: "auto",
                padding: "10px 0",
              }}
            >
              {item.img_urls.map((url, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: currentImageIndex === index 
                      ? "3px solid primary.main" 
                      : "1px solid #ddd",
                    opacity: currentImageIndex === index ? 1 : 0.7,
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                    "&:hover": {
                      opacity: 1,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Product Details */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              color: "primary.main",
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {item.brand} {item.model || item.product_name}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: "error.main",
              fontWeight: "bold",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            {formatPrice(item.price)}
          </Typography>
          <Divider sx={{ width: "100%", my: 2 }} />
          {/* Product Meta */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={`Condition: ${item.condition}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Stock: ${item.stock}`}
              color={item.stock > 0 ? "success" : "error"}
              variant="outlined"
            />
            <Chip
              label={`Category: ${item.category_id?.name}`}
              color="secondary"
              variant="outlined"
            />
            {item.authenticity && (
              <Chip
                label={`Authenticity: ${item.authenticity}`}
                color="info"
                variant="outlined"
              />
            )}
          </Stack>
          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              lineHeight: 1.6,
            }}
          >
            <strong>Description:</strong> {item.product_description}
          </Typography>
          {/* Dates */}
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              color: "text.secondary",
            }}
          >
            <strong>Listed:</strong> {formatDate(item.createdAt)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              color: "text.secondary",
            }}
          >
            <strong>Last Updated:</strong> {formatDate(item.updatedAt)}
          </Typography>
          {/* Seller Info */}
          <Button
            onClick={handleNavigate}
            sx={{
              mb: 2,
              paddingLeft: "0",
              textTransform: "none",
              color: "text.primary",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mr: 1, width: 24, height: 24 }}>
              <Person2OutlinedIcon fontSize="small" />
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Seller: {item.seller_id?.name}
            </Typography>
          </Button>
          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              width: "100%",
              gap: 2,
              mt: 2,
            }}
          >
            
            {prevUrl !== "/cart" && (
              <Button
                variant="outlined"
                color="primary"
                fullWidth={prevUrl === "/cart"}
                sx={{ height: "50px", fontWeight: "bold" }}
                onClick={() => handleAddToCart(item._id)}
              >
                Add to Cart
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Toaster richColors />
    </Card>
  );
};

export default ShowDetailsPage;