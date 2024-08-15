const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./confiq/db.js');
const authRoutes = require('./routes/authRoute.js');
const mobileRoutes = require('./routes/sellMobileRoute.js')
const mobAccessories = require('./routes/mobAccessoriesRoute.js')
const computerRoutes = require('./routes/computerRoute.js')
const electronicRoutes = require('./routes/electronicRoute.js')
const vehicleRoutes = require('./routes/vehicleRoute.js')
const cartRoutes = require('./routes/userCartRoute.js')
const recentlyViewedRoutes = require('./routes/recentlyViewedRoute.js')
const searchRoutes =require('./routes/searchRoute.js')

const cors = require('cors');
const path = require('path');

const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const streamifier = require('streamifier');

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors( 
  // {
  //   origin: ["https://valo-deal-frontend.vercel.app"],
  //   methods: ['POST', 'GET', 'PUT', 'DELETE'],
  //   credentials: true
  // }
));
app.use(express.json());
app.use(morgan("dev"));

const storage = multer.memoryStorage();
const upload = multer({ storage });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
  secure: true,
});

app.post('/upload', upload.single('file'), (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'phone_image',
    },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Upload to Cloudinary failed.' });
      }
      res.status(200).json(result);
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/sell", mobileRoutes); // "/api/v1/sell"
app.use("/sell", computerRoutes); // 
app.use("/sell", electronicRoutes)
app.use("/sell", vehicleRoutes);
app.use("/sell", mobAccessories);  
app.use("/cart", cartRoutes);
app.use("/recentlyViewed", recentlyViewedRoutes)
app.use("/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
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