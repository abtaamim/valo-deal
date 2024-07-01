const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB Database ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.error(`Error in MongoDB connection: ${error.message}`.bgRed.white);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
