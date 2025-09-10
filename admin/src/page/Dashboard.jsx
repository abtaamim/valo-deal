import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab
} from "@mui/material";
import {
  People,
  Inventory,
  Delete,
  Visibility,
  Edit,
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  Category,
  Star
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useAxiosPrivate from "../../../frontend/src/hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// StatCard component for displaying metrics
const StatCard = ({ icon, title, value, subtitle, color, loading }) => (
  <Card sx={{ 
    height: '100%', 
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
    }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: color, mr: 2, width: 48, height: 48 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {loading ? <CircularProgress size={24} /> : value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingProducts: 0
  });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    products: true,
    users: true,
    orders: true
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [activeTab, setActiveTab] = useState(0);
  
  const axiosPrivate = useAxiosPrivate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading({ stats: true, products: true, users: true, orders: true });
      
      // Fetch stats
      const statsResponse = await axiosPrivate.get(`/admin/stats?type=${timeFilter}`);
      const statsData = statsResponse.data;
      
      setStats({
        totalUsers: statsData.summary?.newUsers || 0,
        totalProducts: statsData.summary?.newProducts || 0,
        totalOrders: statsData.summary?.orders?.totalOrders || 0,
        totalRevenue: statsData.summary?.orders?.totalAmount || 0,
        pendingProducts: 0 // You might need to add this to your API
      });
      
      setLoading(prev => ({ ...prev, stats: false }));
      
      // Fetch products
      const productsResponse = await axiosPrivate.get("/admin/products");
      setProducts(productsResponse.data);
      setLoading(prev => ({ ...prev, products: false }));
      
      // Fetch users (if needed)
      const usersResponse = await axiosPrivate.get("/admin/users");
      setUsers(usersResponse.data);
      setLoading(prev => ({ ...prev, users: false }));
      
      // Fetch orders (if needed)
      const ordersResponse = await axiosPrivate.get("/admin/orders");
      setOrders(ordersResponse.data);
      setLoading(prev => ({ ...prev, orders: false }));
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("Failed to load dashboard data");
      setLoading({ stats: false, products: false, users: false, orders: false });
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosPrivate.delete(`/admin/products/${productToDelete._id}`);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Format data for charts based on the API response
  const formatChartData = (data, filter) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      name: filter === 'daily' 
        ? new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : filter === 'weekly' 
          ? `Week ${item._id}`
          : new Date(item._id).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      orders: item.totalOrders || 0,
      revenue: item.totalAmount || 0
    }));
  };

  // Sample category data - replace with real data from your API
  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Fashion', value: 25 },
    { name: 'Home & Kitchen', value: 15 },
    { name: 'Books', value: 10 },
    { name: 'Beauty', value: 15 },
  ];

  return (
    <Box p={3}>
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            displayEmpty
            size="small"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<People />}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            subtitle={`This ${timeFilter}`}
            color="#2196F3"
            loading={loading.stats}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<Inventory />}
            title="Products"
            value={stats.totalProducts.toLocaleString()}
            subtitle={`This ${timeFilter}`}
            color="#4CAF50"
            loading={loading.stats}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<ShoppingCart />}
            title="Orders"
            value={stats.totalOrders.toLocaleString()}
            subtitle={`This ${timeFilter}`}
            color="#FF9800"
            loading={loading.stats}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<AttachMoney />}
            title="Revenue"
            value={`৳${stats.totalRevenue.toLocaleString()}`}
            subtitle={`This ${timeFilter}`}
            color="#F44336"
            loading={loading.stats}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<Category />}
            title="Pending"
            value={stats.pendingProducts.toLocaleString()}
            subtitle="Products awaiting approval"
            color="#9C27B0"
            loading={loading.stats}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Orders & Revenue Overview
            </Typography>
            {loading.stats ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="90%">
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={formatChartData(stats.trends?.orders, timeFilter)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `৳${value}` : value, 
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs for Products and Users */}
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Products" />
          <Tab label="Users" />
          <Tab label="Orders" />
        </Tabs>
        
        {/* Products Tab */}
        {activeTab === 0 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary">
                All Products
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {products.length} products found
              </Typography>
            </Box>
            
            {loading.products ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              src={product.img_urls && product.img_urls[0]} 
                              variant="square"
                              sx={{ width: 56, height: 56, mr: 2 }}
                            >
                              <Inventory />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {product.brand} {product.model}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {product.product_description && product.product_description.substring(0, 50)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={product.category || "Uncategorized"} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            ৳{product.price?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.product_status || "Active"} 
                            color={
                              product.product_status === "approved" ? "success" : 
                              product.product_status === "pending" ? "warning" : "default"
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton color="secondary" size="small">
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        
        {/* Users Tab */}
        {activeTab === 1 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary">
                All Users
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {users.length} users found
              </Typography>
            </Box>
            
            {loading.users ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ width: 40, height: 40, mr: 2 }}
                            >
                              {user.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {user.name || 'Unknown'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role || "user"} 
                            color={user.role === "admin" ? "secondary" : "default"} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Active" 
                            color="success" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" size="small">
                            <Visibility />
                          </IconButton>
                          <IconButton color="secondary" size="small">
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        
        {/* Orders Tab */}
        {activeTab === 2 && (
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary">
                Recent Orders
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {orders.length} orders found
              </Typography>
            </Box>
            
            {loading.orders ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            #{order._id.slice(-6).toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.customerId?.name || 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            ৳{order.totalAmount?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status || "Pending"} 
                            color={
                              order.status === "completed" ? "success" : 
                              order.status === "processing" ? "warning" : "default"
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" size="small">
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.brand} {productToDelete?.model}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;