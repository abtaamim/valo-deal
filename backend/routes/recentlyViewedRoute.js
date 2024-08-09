const express = require('express');
const {recentlyViewedItems, removeFromRecentlyViewed, getRecentlyViewedItems}=require('../controllers/recentlyViewed');
const { requireSignIn } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/:itemType/:itemId',requireSignIn, recentlyViewedItems);
router.delete('/:itemId',requireSignIn, removeFromRecentlyViewed);
router.get('/fetchitems', requireSignIn, getRecentlyViewedItems);

module.exports =router;