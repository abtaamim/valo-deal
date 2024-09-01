const express = require('express');
const {addToCart, removeFromCart, getCartItems, getCartSize, deleteWholeCart}=require('../controllers/userCart')
const { requireSignIn } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/fetchitems', requireSignIn, getCartItems);
router.delete('/clear', requireSignIn, deleteWholeCart );
router.post('/:itemType/:itemId',requireSignIn, addToCart);
router.delete('/:itemId',requireSignIn, removeFromCart);

router.get('/size', requireSignIn, getCartSize);

module.exports =router;