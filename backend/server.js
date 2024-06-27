import express from "express";
import colors from "colors";  // Ensure this is correctly imported
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./confiq/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

// Configure environment variables
dotenv.config();

// Database configuration
connectDB();

// Create an express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
  );
});
