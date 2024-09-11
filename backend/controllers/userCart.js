const computerModel = require('../models/computersModel');
const mobileModel=require('../models/sellMobileModel')
const electronicModel = require('../models/electronicsModel')
const vehicleModel = require('../models/vehiclesModel');
const mobileAccessories= require('../models/mobileAccessoriesModel')
const User = require('../models/userModel')

const getItemModel = (itemType) => {
  switch (itemType) {
    case 'mobile': return mobileModel;
    case 'computer': return computerModel;
    case 'electronic': return electronicModel;
    case 'vehicle': return vehicleModel;
    case 'mobileaccessories': return mobileAccessories;
    case 'mobiles': return mobileModel;
    case 'computers': return computerModel;
    case 'electronics': return electronicModel;
    case 'vehicles': return vehicleModel;
    default: throw new Error('Invalid item type');
  }
};

const addToCart = async (req, res) => {
  
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const itemType = req.params.itemType;
    const itemId = req.params.itemId;
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const ItemModel = getItemModel(itemType);
    const item = await ItemModel.findById(itemId);
    console.log('user:'+typeof (userId)+' seller:'+ typeof (item.sellerId) )
    if(userId === item.sellerId.toString()) {
      return res.status(403).json({ message: 'You cannot add items from your own items.' });
    }
    const existingItem = user.cartItems.find(
      (item) => item.itemId.toString() === itemId
    );

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in cart.' });
    }

    // Add item to the cart
    user.cartItems.push({ itemId: itemId, itemType: itemType });
    await user.save();

    res.status(201).json({ success: true, message: 'Item added to cart.', cartItems: user.cartItems });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};


const removeFromCart = async (req, res) => {
  
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const itemId = req.params.itemId;

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.cartItems = user.cartItems.filter(
      (item) => item.itemId.toString() !== itemId
    );

    await user.save();

    res.status(200).json({ success: true, message: 'Item removed from cart.', cartItems: user.cartItems });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

const getCartItems= async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItems = await Promise.all(user.cartItems.map(async (cartItem) => {
     console.log(cartItem.itemType);
      const ItemModel = getItemModel(cartItem.itemType);
      const item = await ItemModel.findById(cartItem.itemId);
      return { ...item._doc, itemType: cartItem.itemType };
    }));
    console.log(cartItems)

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCartSize = async(req, res) => {
  try{
   const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, cartSize: user.cartItems.length });
  
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
const deleteWholeCart = async(req, res) =>{
  try{
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.markModified('cartItems');
    user.cartItems.length = 0;
    await user.save();
    res.status(200).json({ success: true, message: 'Cart deleted' });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
module.exports ={addToCart, removeFromCart, getCartItems, getCartSize, deleteWholeCart}
