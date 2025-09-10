import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { customAxios } from "../api/axiosPrivate"
import ListingCard from "./CustomItemCard";
import { AddShoppingCartOutlined } from "@mui/icons-material";
import { useCart } from '../context/CartContext';
import { Toaster, toast } from 'sonner';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Grid } from "@mui/material";
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

    fetchProducts();
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
      <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <ListingCard
          items={products}
          handleClickOpen={(itemId) => handleCart(itemId)}
          button={
            <AddShoppingCartOutlined sx={{ color: "rgb(0, 6, 12)" }} />
          }
          offer_per={offer?.discount}
        />
      </Grid>
      <Toaster richColors />
    </>
  )
}