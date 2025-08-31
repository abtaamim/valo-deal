const computerModel = require('../models/computersModel');
const mobileModel = require('../models/sellMobileModel')
const electronicModel = require('../models/electronicsModel')
const vehicleModel = require('../models/vehiclesModel');
const mobileAccessories = require('../models/mobileAccessoriesModel')
const User = require('../models/userModel')

// const getItemModel = (itemType) => {
//   switch (itemType) {
//     case 'mobile': return mobileModel;
//     case 'computer': return computerModel;
//     case 'electronic': return electronicModel;
//     case 'vehicle': return vehicleModel;
//     case 'mobileaccessories': return mobileAccessories;
//     case 'mobiles': return mobileModel;
//     case 'computers': return computerModel;
//     case 'electronics': return electronicModel;
//     case 'vehicles': return vehicleModel;
//     default: throw new Error('Invalid item type');
//   }
// };

// const addToCart = async (req, res) => {

//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     const itemType = req.params.itemType;
//     const itemId = req.params.itemId;
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     const ItemModel = getItemModel(itemType);
//     const item = await ItemModel.findById(itemId);

//     if (userId === item.sellerId.toString()) {
//       return res.status(403).json({ message: 'You cannot add items from your own items.' });
//     }
//     const existingItem = user.cartItems.find(
//       (item) => item.itemId.toString() === itemId
//     );

//     if (existingItem) {
//       return res.status(400).json({ message: 'Item already in cart.' });
//     }

//     // Add item to the cart
//     user.cartItems.push({ itemId: itemId, itemType: itemType, addedTime: new Date() });
//     await user.save();

//     res.status(201).json({ success: true, message: 'Item added to cart.', cartItems: user.cartItems });
//   } catch (error) {
//     console.error('Error adding item to cart:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error', error });
//   }
// };


// const removeFromCart = async (req, res) => {

//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     const itemId = req.params.itemId;

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     user.cartItems = user.cartItems.filter(
//       (item) => item.itemId.toString() !== itemId
//     );

//     await user.save();

//     res.status(200).json({ success: true, message: 'Item removed from cart.', cartItems: user.cartItems });
//   } catch (error) {
//     console.error('Error removing item from cart:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error', error });
//   }
// };

// const getCartItems = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     let itemGotSoldFlag = false;
//     const sortedCartItems = user.cartItems.sort((a, b) => new Date(b.addedTime) - new Date(a.addedTime));
//     const cartItemRes = await Promise.all(sortedCartItems.map(async (cartItem) => {
//       const ItemModel = getItemModel(cartItem.itemType);
//       const item = await ItemModel.findOne({ _id: cartItem.itemId })

//       if (!item) {
//         user.cartItems = user.cartItems.filter(ci => ci.itemId.toString() !== cartItem.itemId.toString());
//         await user.save();
//         return null;
//       }

//       if (item.sold === true) {
//         itemGotSoldFlag = true;
//         user.cartItems = user.cartItems.filter(ci => ci.itemId.toString() !== cartItem.itemId.toString());
//         await user.save();
//         return null;
//       }

//       return { ...item._doc, itemType: cartItem.itemType };
//     }));

//     const cartItems = cartItemRes.filter(item => item !== null);

//     res.status(200).json({ success: true, cartItems, itemGotSoldFlag });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getCartSize = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.status(200).json({ success: true, cartSize: user.cartItems.length });

//   }
//   catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// const deleteWholeCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     user.markModified('cartItems');
//     user.cartItems.length = 0;
//     await user.save();
//     res.status(200).json({ success: true, message: 'Cart deleted' });
//   }
//   catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// }
// module.exports = { addToCart, removeFromCart, getCartItems, getCartSize, deleteWholeCart }

const Cart = require("../models/cart"); // user_cart model
const Product = require("../models/product"); // product model


// Add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Prevent adding own product
    if (userId.toString() === product.seller_id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot add your own product to the cart." });
    }

    // Check if already in cart
    const existingItem = await Cart.findOne({ user_id: userId, product_id: productId });
    if (existingItem) {
      return res.status(400).json({ success: false, message: "Product already in cart." });
    }

    // Add to cart
    const newCartItem = await Cart.create({
      user_id: userId,
      product_id: productId,
      quantity: 1,
      is_selected: true
    });

    res.status(201).json({ success: true, message: "Product added to cart.", cartItem: newCartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const deletedItem = await Cart.findOneAndDelete({ user_id: userId, product_id: productId });

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Product not found in cart." });
    }

    res.status(200).json({ success: true, message: "Product removed from cart." });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ user_id: userId }).sort({ created_at: -1 });

    let itemGotSoldFlag = false;
    const validCartItems = [];

    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.product_id);

      // If product deleted, remove from cart
      if (!product) {
        await Cart.findByIdAndDelete(cartItem._id);
        continue;
      }

      // If sold, remove from cart
      if (product.sold) {
        itemGotSoldFlag = true;
        await Cart.findByIdAndDelete(cartItem._id);
        continue;
      }

      validCartItems.push({ ...product._doc, quantity: cartItem.quantity, is_selected: cartItem.is_selected });
    }

    res.status(200).json({ success: true, cartItems: validCartItems, itemGotSoldFlag });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get cart size
const getCartSize = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartSize = await Cart.countDocuments({ user_id: userId });
    res.status(200).json({ success: true, cartSize });
  } catch (error) {
    console.error("Error getting cart size:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete whole cart
const deleteWholeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.deleteMany({ user_id: userId });
    res.status(200).json({ success: true, message: "Cart cleared successfully." });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartItems,
  getCartSize,
  deleteWholeCart
};
