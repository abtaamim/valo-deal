const electronicModel = require('../models/electronicsModel');

const electronicController = async (req, res) => {
  try {
    const { sellerId, subCategory, brand,  model, condition, description, price, imgUrl } = req.body;

    if (!sellerId || !brand || !model || !condition || !subCategory || !description || !price || !imgUrl) {
      console.error('Validation failed:', { sellerId, brand, model, condition, authenticity, description, price,imgUrl });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newElec = new electronicModel({
      sellerId,
      brand,
      model,
      condition,
      subCategory,
      description,
      price,
      imgUrl
    });

    await newElec.save();
    console.log('Received data:', { sellerId, brand, model, condition, subCategory , description, price, imgUrl });

    res.status(200).send('Product listed successfully');
  } catch (error) {
    console.error('Error listing product:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getAllEletronicsController = async (req, res) => {
  try {
    const userId = req.user._id; 
    const electronics = await electronicModel.find({ sellerId: { $ne: userId } });

    if (electronics.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    }

    res.status(200).json({ success: true, electronics });
  } catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getSubcatElectronisController = async (req, res) => {
  try {
    const userId = req.user._id; 
    const  subCategory  = req.params.subCategory;
    const electronics =await electronicModel.find({subCategory: subCategory , sellerId: { $ne: userId } });
    if (electronics.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    }

    res.status(200).json({ success: true, electronics });
  }catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getAddedElectronic = async(req, res)=>{
  try {
    const userId = req.user._id; 
    const electronics = await electronicModel.find({ sellerId: userId });

    if (electronics.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    }

    res.status(200).json({ success: true, electronics });
  } catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const deleteElectronic = async (compId) => {
  try {
    await electronicModel.findByIdAndDelete(compId);
 
  } catch (error) {
    console.error('Error deleting computer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
const getLatestElectronic = async (req, res) => {
  try {
    const userId = req.user._id; 
    const latestElectronic = await electronicModel.find({ sellerId:  {$ne:userId}  })//{ $ne:
      .sort({ createdAt: -1 }).limit(3) .exec();
     
    if (!latestElectronic) {
      return res.status(404).json({ success: false, message: 'No Electronics found' });
    }
    res.status(200).json({ success: true,  latestElectronic });
  } catch (error) {
    console.error('Error fetching the latest Electronic:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
module.exports = {electronicController, getAllEletronicsController, getSubcatElectronisController, getAddedElectronic, deleteElectronic, getLatestElectronic};