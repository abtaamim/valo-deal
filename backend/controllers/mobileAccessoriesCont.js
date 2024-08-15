
const mobAccModel=require('../models/mobileAccessoriesModel')
const mobAccessoriesCont = async (req, res) => {
  try {
    const { sellerId, brand, model, condition, authenticity, description, price, imgUrl, accessoryType } = req.body;
    //const files = req.files;
    //const imagePaths = files.map(file => `/uploads/${file.filename}`);

    if (!sellerId || !brand || !model || !condition || !authenticity || !description || !price || !imgUrl) {
      console.error('Validation failed:', { sellerId, brand, model, condition, authenticity, description, price,imgUrl });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newMobile = new mobAccModel({
      sellerId,
      brand,
      model,
      condition,
      accessoryType,
      authenticity,
      description,
      price,
      imgUrl
    });

    await newMobile.save();
    console.log('Received data:', { sellerId, brand, model, condition, authenticity, description, price, imgUrl, accessoryType });

    res.status(200).send('Product listed successfully');
  } catch (error) {
    console.error('Error listing product:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getAllMobAccessories = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user

    // Fetch mobileAccessories where sellerId is not equal to userId
    const mobileAcc = await mobAccModel.find({ sellerId: { $ne: userId } });

    if (mobileAcc.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobileAccessories found for the user' });
    }

    res.status(200).json({ success: true, mobileAcc });
  } catch (error) {
    console.error('Error fetching user mobileAccessories:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getAddedMobileAccessories = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const mobileAccessories = await mobAccModel.find({ sellerId: userId });
    res.status(200).json({ success: true, mobileAccessories });
  } catch (error) {
    console.error('Error fetching user mobileAccessories:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const deleteMobileAccessories = async (mobileId) => {
  try {
    // Assuming mobAccModel.findByIdAndDelete is used to delete the mobile listing
    await mobAccModel.findByIdAndDelete(mobileId);
  } catch (error) {
    throw error; // Propagate the error to handle it in the calling route
  }
};

const getLatestMobileAccesories = async (req, res) => {
  try {
    const userId = req.user._id; 
    const latestMobileAccessories = await mobAccModel.find({ sellerId:  {$ne: userId } })
      .sort({ createdAt: -1 }).limit(3) .exec();
     
    if (!latestMobileAccessories) {
      return res.status(404).json({ success: false, message: 'No Mobiles found' });
    }
    res.status(200).json({ success: true,  latestMobileAccessories });
  } catch (error) {
    console.error('Error fetching the latest Mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
module.exports = { mobAccessoriesCont, getAllMobAccessories, getAddedMobileAccessories, deleteMobileAccessories, getLatestMobileAccesories };


