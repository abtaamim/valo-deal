const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

// Protected Routes token base
exports.requireSignIn = async (req, res, next) => {
  try {
   // const token = req.headers.authorization.split(" ")[1];
    const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized Access" });
  }
};

// Admin access middleware
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error in admin middleware", error: error.message });
  }
};
