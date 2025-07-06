const computerModel = require('../models/computersModel')
const mobileModel = require('../models/sellMobileModel')
const vehicleModel = require('../models/vehiclesModel')
const electronicModel = require('../models/electronicsModel')
const getItemModel = (itemType) => {
  switch (itemType) {
    case 'mobile': return mobileModel;
    case 'computer': return computerModel;
    case 'electronic': return electronicModel;
    case 'vehicle': return vehicleModel;
    // case 'mobileaccessories': return mobileAccessories;
    case 'mobiles': return mobileModel;
    case 'computers': return computerModel;
    case 'electronics': return electronicModel;
    case 'vehicles': return vehicleModel;
    default: throw new Error('Invalid item type');
  }
};
const getUnacceptedProduct = async (req, res) => {
  try {
    const unaccepted = await Promise.all([computerModel.find({ request: 'unaccepted' }),
    mobileModel.find({ request: 'unaccepted' }), vehicleModel.find({ request: 'unaccepted' }), electronicModel.find({ request: 'unaccepted' })]);
    res.status(200).json({ success: true, unacceptedProducts: unaccepted });
  } catch (e) {
    console.error('Error fetching unaccepted products:', error);
    res.status(500).json({ success: false, message: 'error fetching unaccepted products' });
  }
}

const acceptProduct = async (req, res) => {
  try {
    const { id, type } = req.body;
    const itemModel = getItemModel(type);
    const product = await itemModel.findByIdAndUpdate(id, { request: 'accepted' });
    res.status(200).json({ success: true, message: 'product accepted successfully' });
  } catch (e) {
    console.error('Error accepting computer:', error);
    res.status(500).json({ success: false, message: 'Error accepting product' });
  }
}
module.exports = { getUnacceptedProduct, acceptProduct }