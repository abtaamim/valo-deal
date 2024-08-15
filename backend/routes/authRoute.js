const express = require('express');
const {
  registerController,
  loginController,
  refreshTokenController, // Add this line
  forgotPasswordController,
  updateProfileController,
  testController,
} = require("../controllers/authController.js");
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh-token', refreshTokenController); // Add this line
router.post('/forgot-password', forgotPasswordController);
router.put('/profile', requireSignIn, updateProfileController);
router.get('/test', requireSignIn, isAdmin, testController);
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
