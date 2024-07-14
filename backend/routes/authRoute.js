const express = require('express');
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

module.exports = router;
