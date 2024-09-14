const express = require('express');
const userModel = require('../models/userModel.js');
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  refresh, logout
} = require("../controllers/authController.js");
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.put('/profile', requireSignIn, updateProfileController); // Add this line
router.get('/test', requireSignIn, isAdmin, testController);
router.get('/refresh', refresh)
router.post('/logout', logout)
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//for seller information
router.get('/seller-info/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    const response = await userModel.findById({ _id: sellerId });
    if (!response) {
      return res.status(404).json({ success: false, message: 'User not found' });  // add a 404 response for user not found
    }
    // console.log(response)
    const { name, email, phone, address } = response;
    res.status(200).send({
      success: true,
      message: "Seller info",
      seller: {
        sellerId: sellerId,
        name: name ? name : 'noname',
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
