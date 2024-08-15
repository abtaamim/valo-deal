const express = require('express');
const userModel = require('../models/userModel.js');
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController // Add this line
} = require("../controllers/authController.js");
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.put('/profile', requireSignIn, updateProfileController); // Add this line
router.get('/test', requireSignIn, isAdmin, testController);
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//for seller information
router.get('/seller-info/:id',  async (req, res) => {
  try {
    const sellerId = req.params.id;
    const response = await userModel.findOne({ _id: sellerId });
    const { name, email, phone, address } = response;
    res.status(200).send({
      success: true,
      message: "Seller info",
      seller: {
        sellerId: sellerId,
        name,
        email,
        phone,
        address,
      },
    });
  } catch (error) {
    console.log("error retreiving seller ", error);
  }

});
module.exports = router;
