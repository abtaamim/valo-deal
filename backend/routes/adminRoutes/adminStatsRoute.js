const express = require('express');
const{getAdminStats}=require("../../controllers/adminController/adminStats")
const {requireSignIn,isAdmin} = require("../../middlewares/authMiddleware")
const router = express.Router();
router.get("/dashboard-stats", requireSignIn, isAdmin, getAdminStats);

module.exports = router;