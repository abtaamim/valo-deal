const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./confiq/db.js');
const authRoutes = require('./routes/authRoute.js');
const cors = require('cors');

// Configure environment variables
dotenv.config();

// Database configuration
connectDB();

// Create an express app
const app = express();

// Middlewares
app.use(cors(
  // {
  //   origin: ["https://valo-deal-frontend.vercel.app"],
  //   methods: ['POST', 'GET'],
  //   credentials: true
  // }
));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.json("<h1>Welcome to ecommerce app</h1>");
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
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`
  );
});
