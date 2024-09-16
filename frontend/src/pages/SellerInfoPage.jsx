import { useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
const SellerInfo = () => {
  const location = useLocation();
  const { name, phone, address, email } = location.state || {};
  return (
    <>
      <Box sx={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Seller Info</Typography>
        <Typography variant="body1" sx={{ marginTop: "5px" }}>Name: {name}</Typography>
        <Typography variant="body1" sx={{ marginTop: "5px" }}>Phone: {phone}</Typography>
        <Typography variant="body1" sx={{ marginTop: "5px" }}>Address: {address}</Typography>
        <Typography variant="body1" sx={{ marginTop: "5px" }}>Email: {email}</Typography>
      </Box>
    </>
  )
}

export default SellerInfo;
