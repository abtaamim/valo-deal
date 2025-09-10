const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

// Protected Routes token base
exports.requireSignIn = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) { //no accesstoken means user logged out
    return res.status(401).json({ message: 'Unauthorized in middleware' })
  }
  //console.log(authHeader);
  const token = authHeader.split(' ')[1]
  JWT.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({
        message: 'Forbidden' + err
      })
      req.user = decoded;
      console.log(req.user)
      next()
    }
  )

};

// Admin access middleware
exports.isAdmin = async (req, res, next) => {
  console.log("email: " + req.user?._id)
  console.log("role: "+ req.user?.role)
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
