const computerModel = require('../models/computersModel');
const mobileModel=require('../models/sellMobileModel')
const electronicModel = require('../models/electronicsModel')
const vehicleModel = require('../models/vehiclesModel');
const User = require('../models/userModel')

const getItemModel = (itemType) => {
  switch (itemType) {
    case 'mobile': return mobileModel;
    case 'computer': return computerModel;
    case 'electronic': return electronicModel;
    case 'vehicle': return vehicleModel;
    default: throw new Error('Invalid item type');
  }
};

const recentlyViewedItems= async(req, res)=>{
  try{
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const itemType = req.params.itemType;
    const itemId = req.params.itemId;
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingItem = user.recentlyViewedItems.find(
      (item) => item.itemId.toString() === itemId
    );

    if (existingItem) {
      user.recentlyViewedItems = user.recentlyViewedItems.filter(
        (item) => item.itemId.toString() !== itemId
      );
      //return res.status(400).json({ message: 'Item already in cart.' });
    }

    user.recentlyViewedItems.push({ itemId: itemId, itemType: itemType, viewedAt: new Date() });
    await user.save();

    res.status(201).json({ success: true, message: 'Item added to cart.', recentlyViewedItems: user.recentlyViewedItems });
  } catch (error) {
    console.error('Error adding item to recentlyviewed:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

const removeFromRecentlyViewed = async (req, res) => {
  
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const itemId = req.params.itemId;

    user.recentlyViewedItems = user.recentlyViewedItems.filter(
      (item) => item.itemId.toString() !== itemId
    );

    await user.save();

    res.status(200).json({ success: true, message: 'Item removed from cart.', recentlyViewedItems: user.recentlyViewedItems });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

const getRecentlyViewedItems= async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const recentlyViewedItems = await Promise.all(user.recentlyViewedItems.map(async (recentlyViewed) => {
      const ItemModel = getItemModel(recentlyViewed.itemType);
      const item = await ItemModel.findById(recentlyViewed.itemId);
      return { ...item._doc, itemType: recentlyViewed.itemType };
    }));

    res.status(200).json({ success: true, recentlyViewedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { recentlyViewedItems, removeFromRecentlyViewed, getRecentlyViewedItems };