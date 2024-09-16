const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

// Protected Routes token base
exports.requireSignIn = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized in middleware' })
  }
  console.log(authHeader);
  const token = authHeader.split(' ')[1]
  JWT.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({
        message: 'Forbidden' + err
      })
      req.user = decoded;
      next()
    }
  )

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
