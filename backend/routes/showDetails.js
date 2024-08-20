const express = require('express');
const router = express.Router();
const computerModel = require('../models/computersModel');
const mobileModel = require('../models/sellMobileModel')
const electronicModel = require('../models/electronicsModel')
const vehicleModel = require('../models/vehiclesModel');

const getItemModel = (itemType) => {
  switch (itemType) {
    case 'mobile': return mobileModel;
    case 'computer': return computerModel;
    case 'electronic': return electronicModel;
    case 'vehicle': return vehicleModel;
    default: throw new Error('Invalid item type');
  }
};
router.get('/:itemType/:itemId', async (req, res) => {
  try {
    const itemType = req.params.itemType;
    const itemId = req.params.itemId;
    const itemModel = getItemModel(itemType);
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }else{
      res.status(200).json(item);
    }
  }
  catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
)

module.exports = router;
