import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { customAxios } from "../api/axiosPrivate"
import ListingCard from "./CustomItemCard";
import { AddShoppingCartOutlined } from "@mui/icons-material";
import { useCart } from '../context/CartContext';
import { Toaster, toast } from 'sonner';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Grid, Typography, Box, Card, CardMedia, CardContent, Chip } from "@mui/material";
import { format } from "date-fns";
export default function OfferProductPage() {
  const { offer_id } = useParams();
  const [offer, setOffer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState();
  const { updateCartSize } = useCart();
  const axiosPrivate = useAxiosPrivate()
  // fetch offer
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await customAxios.get(`/offer/${offer_id}`);
        setOffer(res.data);
      } catch (err) {
        console.error("Error fetching offer:", err);
      }
    };

    fetchOffer();
  }, [offer_id]);

  useEffect(() => {
    
    const fetchProducts = async () => {
      if (!offer) return;
      try {
        const responses = await Promise.all(
          offer.category_ids.map((id) =>
            customAxios.get(`/product/category/${id}`)
          )
        );
        const allProducts = responses.flatMap((res) => res.data);
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    if (
      new Date(offer?.starting_at) < new Date() &&
      new Date(offer?.ending_at) > new Date()
    ) {
      fetchProducts();
    }

    
  }, [offer]);

  const handleCart = async (itemId) => {
    try {
      const res = await axiosPrivate.post(`/cart/${itemId}`);
      await updateCartSize();
      toast.success(
        <div onClick={() => navigate("/cart")}>
          Item added to the cart! 
        </div>,
        { position: "bottom-right", autoClose: false }
      );

    } catch (error) {
      toast.error(`${error.response.data.message}`, { position: "bottom-right" });
      console.error(`Error adding to cart ${itemType}:`, error);
    }
  };
  return (
    <>
      <Card sx={{ borderRadius: 3, overflow: "hidden", mb: 4, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="300"
          image={offer?.img_urls[0]}
          alt={offer?.title}
        />
        <CardContent sx={{ textAlign: "center", backgroundColor: "rgba(0,0,0,0.05)" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {offer?.title}
          </Typography>
          <Chip
            label={`${offer?.discount}% OFF`}
            color="secondary"
            sx={{ fontWeight: "bold", fontSize: "1rem", mb: 1 }}
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            {offer?.description}
          </Typography>
          {offer?.starting_at && offer?.ending_at && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Starts: {format(new Date(offer?.starting_at), "PPP p")} |
              Ends: {format(new Date(offer?.ending_at), "PPP p")}
            </Typography>
          )}

        </CardContent>
      </Card>
      {new Date(offer?.starting_at) < new Date() &&
        new Date(offer?.ending_at) > new Date() ? (<Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              width: "100%",
              textAlign: "center",
              color: "violet",
              fontWeight: "bold",
              textShadow: "1px 1px 6px rgba(0,0,0,0.2)",
              my: 2,
            }}
          >
            {products.length} products found
          </Typography>
          <ListingCard
          items={products}
          handleClickOpen={(itemId) => handleCart(itemId)}
          button={
            <AddShoppingCartOutlined sx={{ color: "rgb(0, 6, 12)" }} />
          }
          offer_per={offer?.discount}
        />
      </Grid>) :
        <Box
          sx={{
            height: "60vh", // occupy enough vertical space
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.05)", // subtle background
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "violet",
              fontWeight: "bold",
              textShadow: "1px 1px 6px rgba(0,0,0,0.2)",
            }}
          >
            This offer has not started yet!
          </Typography>
        </Box>
      }
      
      <Toaster richColors />
    </>
  )
}