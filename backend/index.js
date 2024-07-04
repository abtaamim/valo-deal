const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoute.js');
const cors = require('cors');

// Configure environment variables
dotenv.config();

// Database configuration
connectDB();

// Create an express app
const app = express();

// Middlewares
app.use(cors({
  origin: ["https://valo-deal-frontend.vercel.app"],
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Serve static files from the React app
const buildPath = path.join(__dirname, '..', 'frontend', 'dist'); // Change 'build' to 'dist' if using 'dist'
app.use(express.static(buildPath));

// Routes
app.use("/api/v1/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// Catch-all route to serve React's index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`
  );
});
