const express = require('express');
const router = express.Router();
const computerModel = require('../models/computersModel');
const mobileModel = require('../models/sellMobileModel')
const electronicModel = require('../models/electronicsModel')
const vehicleModel = require('../models/vehiclesModel');
const mobileAccessories = require('../models/mobileAccessoriesModel')
const User = require('../models/userModel');
const soldItemModel = require('../models/soldItemModel');
const { requireSignIn } = require('../middlewares/authMiddleware');

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
router.post('/setOrder', async (req, res) => {
  // const buyerId = req.user._id;

  try {
    const { buyerId, sellerId, itemType, itemId, soldDate, deliveryAddress } = req.body;
    // console.log(buyerId, sellerId, itemType, itemId, soldDate, deliveryAddress)
    const soldItem = await new soldItemModel(
      {
        buyerId,
        sellerId,
        itemType,
        itemId,
        soldDate,
        deliveryAddress
      }
    ).save();
    const item = await getItemModel(itemType).findById(itemId).exec();
    if (item) {
      item.sold = true;
      await item.save();
    }

    res.status(201).json({ message: "item added to soldModel", soldItem })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get('/ItemType/:id', requireSignIn, async (req, res) => {
  const sellerId = req.params.id;
  const soldItemTypes = [{ name: 'mobiles', number: 0 }, { name: 'electronics', number: 0 },
  { name: 'computers', number: 0 }, { name: 'vehicles', number: 0 }
  ]
  const user = await User.findById(sellerId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });  // add a 404 response for user not found
  }
  console.log(user)
  try {
    const soldItems = await soldItemModel.find({ sellerId: sellerId }).exec();
    console.log(soldItems)
    const items = await Promise.all(soldItems.map(async (cur_item) => {
      const ItemModel = getItemModel(cur_item.itemType);
      if (cur_item.itemType === 'mobiles' || cur_item.itemType === 'mobile') {
        soldItemTypes[0].number++
      }
      else if (cur_item.itemType === 'electronics' || cur_item.itemType === 'electronic') {
        soldItemTypes[1].number++
      }
      else if (cur_item.itemType === 'computers' || cur_item.itemType === 'computer') {
        soldItemTypes[2].number++
      }
      else if (cur_item.itemType === 'vehicles' || cur_item.itemType === 'vehicle') {
        soldItemTypes[3].number++
      }
      const item = await ItemModel.findById(cur_item.itemId);
      return { soldItemTypes: soldItemTypes };
    }));
    console.log(soldItemTypes)
    res.status(200).json({ soldItemTypes: soldItemTypes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get('/soldItem', requireSignIn, async (req, res) => {
  const userId = req.user._id;

  try {
    const soldItems = await soldItemModel.find({ sellerId: userId }).exec();
    const items = await Promise.all(soldItems.map(async (cur_item) => {
      const ItemModel = getItemModel(cur_item.itemType);
      const item = await ItemModel.findById(cur_item.itemId);
      return { ...item._doc, soldDate: cur_item.soldDate };
    }));
    res.status(200).json({ items })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/boughtItem', requireSignIn, async (req, res) => {

  try {
    const userId = req.user._id;
    const boughtItems = await soldItemModel.find({ buyerId: userId }).exec();
    const items = await Promise.all(boughtItems.map(async (cur_item) => {
      const ItemModel = getItemModel(cur_item.itemType);
      const item = await ItemModel.findById(cur_item.itemId);
      return { ...item._doc, boughtDate: cur_item.soldDate };
    }));
    res.status(200).json({ items })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router;