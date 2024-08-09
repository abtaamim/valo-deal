const express = require('express');
const {addToCart, removeFromCart, getCartItems, getCartSize}=require('../controllers/userCart')
const { requireSignIn } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:itemType/:itemId',requireSignIn, addToCart);
router.delete('/:itemId',requireSignIn, removeFromCart);
router.get('/fetchitems', requireSignIn, getCartItems);
router.get('/size', requireSignIn, getCartSize);

module.exports =router;