import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tooltip,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  ListItemButton,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Pagination,
  Modal,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../context/auth";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../siteComponents/styles.css";
import { customAxios } from "../api/axiosPrivate";
import image1 from "../assests/h1.jpg";
import image2 from "../assests/h2.jpg";
import image3 from "../assests/h3.jpg";
import image4 from "../assests/h4.jpg";
import image5 from "../assests/mobile.png";
import image6 from "../assests/pc.png";
import image7 from "../assests/car.jpg";
import image8 from "../assests/camera.png";
import offerImage from "../assests/offer.jpg";


const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const HomeSlider = () => (
  <Box sx={{ marginBottom: "1px" }}>
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      interval={2700}
      renderArrowPrev={(onClickHandler, hasPrev, label) =>
        hasPrev && (
          <Box
            onClick={onClickHandler}
            title={label}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "130px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              color: "white",
              fontSize: "60px",
              zIndex: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            &#10094;
          </Box>
        )
      }
      renderArrowNext={(onClickHandler, hasNext, label) =>
        hasNext && (
          <Box
            onClick={onClickHandler}
            title={label}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "130px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              color: "white",
              fontSize: "60px",
              zIndex: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            &#10095;
          </Box>
        )
      }
    >
      <div className="image-container">
        <img src={image1} alt="Essentials for Gamers" />
      </div>
      <div className="image-container">
        <img src={image2} alt="Deals in PCs" />
      </div>
      <div className="image-container">
        <img src={image3} alt="Home décor under $50" />
      </div>
      <div className="image-container">
        <img src={image4} alt="Shop deals in Fashion" />
      </div>
    </Carousel>
  </Box>
);

const categories = [
  {
    title: "Latest mobile collections",
    image: image5,
    link: "/sub-category-item/Mobiles/MobilePhones",
  },
  {
    title: "Best cameras",
    image: image8,
    link: "/sub-category-item/Electronics/Cameras",
  },
  {
    title: "Deals in PCs,Laptops",
    image: image6,
    link: "/sub-category-item/Computers/Computer%20Components",
  },
  {
    title: "Car on sale 🔥",
    image: image7,
    link: "/sub-category-item/Vehicles/Car",
  },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("BDT", "৳");
};

const CategorySection = () => {
  const [offers, setOffer] = useState();
  const fetchOffers = async () => {
    try {
      // setLoading(true);
      const res = await customAxios.get("/offer/active-offers");
      setOffer(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {offers?.map((offer, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link to={`/offer-product/${offer._id}`} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  borderRadius: "20px",
                  position: "relative",
                  transform: "perspective(1000px)",
                  transition:
                    "transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    transform: "scale(1.08) rotateY(6deg) rotateX(4deg)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
                  },
                  "&:hover .imageOverlay": {
                    opacity: 0.5,
                  },
                  "&:hover .title": {
                    textShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={offer.img_urls[0]}
                    alt={offer.title}
                    sx={{
                      transition: "transform 0.6s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.3)",
                      },
                    }}
                  />

                  <Box
                    className="imageOverlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8))",
                      opacity: 0,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  ></Box>
                  <Typography
                    variant="h6"
                    className="title"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "1.2px",
                      transition: "text-shadow 0.5s ease-in-out",
                    }}
                  >
                    {offer.title}
                  </Typography>
                </Box>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ListingCard = ({
  item,
  onAddToCart,
  onViewDetails,
  sellerName,
  isLoading,
}) => (
  <Card
    onClick={onViewDetails}
    sx={{
      width: "300px",
      height: "500px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: "16px",
      border: "1px solid #4d4d4d",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
      backgroundColor: "#1f232c",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.4s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      },
    }}
  >
    {isLoading && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <CircularProgress size={30} sx={{ color: "white" }} />
      </Box>
    )}
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <CardMedia
        component="img"
        height="240"
        image={item.img_urls[1]}
        alt={`${item.brand} ${item.model}`}
        src={item.img_urls}
        sx={{
          transition: "transform 0.8s ease-in-out", // Longer duration for smoothness
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
    </Box>
    <CardContent
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        backgroundColor: "#222324",
        color: "white",
      }}
    >
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ color: "#eaeaea" }}
      >
        {item.brand} {item.model}
      </Typography>
      <Typography variant="body2" color="#7e7e7e">
        Condition: {item.condition}
      </Typography>
      <Typography variant="body2" color="#7e7e7e">
        {item.authenticity ? `Authenticity: ${item.authenticity}` : ""}
      </Typography>
      <Typography variant="body2" color="#7e7e7e" noWrap>
        Description: {item.product_description}
      </Typography>
      <Typography variant="body2" color="#b1afac">
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Typography>
      <ListItemButton
        sx={{ padding: "0", mt: "10px", height: "32px", color: "#bebebe" }}
      >
        Seller : {item.seller_id.name}
      </ListItemButton>
    </CardContent>
    <CardActions
      sx={{ justifyContent: "space-between", backgroundColor: "#222324" }}
    >
      <Typography variant="body2" sx={{ color: "#cecdcd", fontWeight: "bold" }}>
        Price: {formatPrice(item.price)}
      </Typography>
      <Tooltip title="Add this item to your cart">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          sx={{
            color: "#FF8C00",
            "&:hover": {
              color: "green",
            },
          }}
        >
          <AddShoppingCartSharpIcon />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

const HomePage = () => {
  const navigate = useNavigate();

  const handleCloseModalAndNavigate = () => {
    setOpenModal(false);
    navigate("/sub-category-item/Electronics/Other%20Electronics");
  };

  const [items, setItems] = useState({
    mobiles: [],
    computers: [],
    electronics: [],
    vehicles: [],
  });
  const [auth] = useAuth();
  const { updateCartSize } = useCart();
  const [sellerMap, setSellerMap] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(null);

  const [postsPerPage] = useState(12);
  const [sortOrder, setSortOrder] = useState("");
  const [allItems, setAllItems] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const [openModal, setOpenModal] = useState(false);

  // const fetchItems = async () => {
  //   try {
  //     setLoading(true);
  //     const [
  //       mobilesResponse,
  //       computersResponse,
  //       electronicResponse,
  //       vehicleResponse,
  //     ] = await Promise.all([
  //       axios.get("https://valo-deal-backend.vercel.app/sell/latest-mobiles"),
  //       axios.get("https://valo-deal-backend.vercel.app/sell/latest-computers"),
  //       axios.get(
  //         "https://valo-deal-backend.vercel.app/sell/latest-electronics"
  //       ),
  //       axios.get("https://valo-deal-backend.vercel.app/sell/latest-vehicles"),
  //     ]);
  //     setItems({
  //       mobiles: mobilesResponse.data.latestMobile,
  //       computers: computersResponse.data.latestComputer,
  //       electronics: electronicResponse.data.latestElectronic,
  //       vehicles: vehicleResponse.data.latestVehicle,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching items:", error);
  //     toast.error("Failed to fetch items. Please try again later.", {
  //       position: "bottom-right",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await customAxios.get('/product/active')
      setAllItems(res.data)
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items. Please try again later.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetchItems();
    updateCartSize();
  }, [auth]);

  // const handleViewDetails = async (itemId, itemType) => {
  //   try {
  //     await axiosPrivate.post(`/recentlyViewed/${itemType}/${itemId}`);
  //     setLoadingProduct(itemId);

  //     setTimeout(() => {
  //       navigate(`/details/${itemType}/${itemId}`);
  //       setLoadingProduct(null);
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Error viewing details:", error);
  //     toast.error("Failed to load details. Please try again.", {
  //       position: "bottom-right",
  //     });
  //   }
  // };
  const handleViewDetails = async (itemId) => {
    try {
      // await axiosPrivate.post(`/recentlyViewed/${itemType}/${itemId}`);
      setLoadingProduct(itemId);

      setTimeout(() => {
        navigate(`/details/${itemId}`);
        setLoadingProduct(null);
      }, 1500);
    } catch (error) {
      console.error("Error viewing details:", error);
      toast.error("Failed to load details. Please try again.", {
        position: "bottom-right",
      });
    }
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



  const handleSortChange = (event) => {
    const selectedSortOrder = event.target.value;
    setSortOrder(selectedSortOrder);

    const sortedItems = [...allItems].sort((a, b) => {
      if (selectedSortOrder === "lowToHigh") {
        return a.price - b.price;
      } else if (selectedSortOrder === "highToLow") {
        return b.price - a.price;
      } else {
        return 0;
      }
    });

    setAllItems(sortedItems);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allItems.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    // if (!auth.user) {
    const modalShownDate = localStorage.getItem("modalShownDate");
    const today = getTodayDate();
    // console.log('date', modalShownDate)
    if (modalShownDate !== today || !modalShownDate) {
      //  console.log("Non-signed-in user: Setting timer to show modal.");
      const timer = setTimeout(() => {
        setOpenModal(true);
        localStorage.setItem("modalShownDate", today);
        //localStorage.setItem('modalShownSignedIn', true);
        //   console.log("Modal shown for non-signed-in user.");
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // console.log("Non-signed-in user: Modal already shown today.");
    }
    // }
  }, [auth.user]);

  useEffect(() => {
    if (auth.user) {
      const modalShownSignedIn = localStorage.getItem("modalShownSignedIn");
      if (!modalShownSignedIn) {
        // console.log("Signed-in user: Setting timer to show modal.");
        const timer = setTimeout(() => {
          setOpenModal(true);
          localStorage.setItem("modalShownSignedIn", "true");
          //  console.log("Modal shown for signed-in user.");
        }, 5000);

        return () => clearTimeout(timer);
      } else {
        // console.log("Signed-in user: Modal already shown this session.");
      }
    }
    //  else {
    //   localStorage.removeItem("modalShownSignedIn");
    //   console.log("User signed out: Removed modalShownSignedIn flag.");
    // }
  }, [auth.user]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              backgroundColor: "transparent",
            }}
          >
            <CircularProgress size={50} sx={{ color: "#ff8c00" }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                  "50%": {
                    transform: "scale(1.1)",
                    opacity: 0.7,
                  },
                  "100%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            >
              Please Wait...
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <HomeSlider />
          <CategorySection />
          <Box sx={{ p: 2, bgcolor: "#373839", pl: 5, pr: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id="sort-label" sx={{ color: "white" }}>
                  Sort by
                </InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortOrder}
                  onChange={handleSortChange}
                  label="Sort by"
                  sx={{
                    color: "white",
                    border: "1px solid grey",
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em style={{ color: "black" }}>None</em>
                  </MenuItem>
                  <MenuItem value="lowToHigh" sx={{ color: "black" }}>
                    Price: Low to High
                  </MenuItem>
                  <MenuItem value="highToLow" sx={{ color: "black" }}>
                    Price: High to Low
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={3}>
              {currentPosts.map((item) => (
                <Grid item key={item._id} xs={12} sm={6} md={4} xl={3}>
                  <ListingCard
                    item={item}
                    isLoading={loadingProduct === item._id}
                    onAddToCart={() => handleAddToCart(item._id)}
                    onViewDetails={() =>
                      handleViewDetails(item._id)
                    }
                    sellerName={sellerMap.get(item.sellerId)?.name || ""}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(allItems.length / postsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "grey",
                    color: "white",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "grey",
                    color: "white",
                  },
                }}
              />
            </Box>
          </Box>

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="offer-modal-title"
            aria-describedby="offer-modal-description"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                bgcolor: "#fff",
                boxShadow: 24,
                borderRadius: "16px",
                p: 0,
                width: {
                  xs: "90%",
                  sm: "80%",
                  md: "60%",
                  lg: "50%",
                  xl: "40%",
                },
                maxWidth: "800px",
                height: "auto",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "grey.500",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  },
                  zIndex: 2,
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* OfferImage */}
              <img
                src={offerImage}
                alt="Special Offer"
                style={{
                  width: "100%",
                  height: "85%",
                  objectFit: "contain",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
                onClick={handleCloseModalAndNavigate}
              />
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};
export default HomePage;
