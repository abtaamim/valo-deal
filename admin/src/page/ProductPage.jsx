import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import { customAxios } from "../../../frontend/src/api/axiosPrivate"; // adjust path if needed
import useAxiosPrivate from "../../../frontend/src/hooks/useAxiosPrivate";

export default function PendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  // Fetch pending products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get("/product/pending"); // <-- adjust route to your getPendingProducts
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Change product status
  const updateStatus = async (id, status) => {
    try {
      await axiosPrivate.put(`/product/change-status/${id}`, { status }); // <-- adjust to your backend route
      fetchProducts(); // refresh list after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Pending Products
      </Typography>

      {products.length === 0 ? (
        <Typography>No pending products found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Seller</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category_id?.name || "N/A"}</TableCell>
                  <TableCell>{product.seller_id?.email || "N/A"}</TableCell>
                  <TableCell>{product.product_status}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => updateStatus(product._id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => updateStatus(product._id, "rejected")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
