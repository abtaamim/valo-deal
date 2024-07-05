const mobileModel=require('../models/sellMobileModel')

const sellMobileController = async (req, res) => {
  try {
    const { sellerId, brand, model, condition, authenticity, description, price } = req.body;
    const files = req.files;
    const imagePaths = files.map(file => `/uploads/${file.filename}`);

    if (!sellerId || !brand || !model || !condition || !authenticity || !description || !price || imagePaths.length === 0) {
      console.error('Validation failed:', { sellerId, brand, model, condition, authenticity, description, price, images });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newMobile = new mobileModel({
      sellerId,
      brand,
      model,
      condition,
      authenticity,
      description,
      price,
      images: imagePaths,
    });

    await newMobile.save();
    console.log('Received data:', { sellerId, brand, model, condition, authenticity, description, price, images:imagePaths });

    res.status(200).send('Product listed successfully');
  } catch (error) {
    console.error('Error listing product:', error);
    res.status(500).send('Internal Server Error');
  }
};

// New controller to get mobiles for the current user
const getUserAddedMobilesController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const mobiles = await mobileModel.find({ sellerId: userId });
    res.status(200).json({ success: true, mobiles });
  } catch (error) {
    console.error('Error fetching user mobiles:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
const deleteMobileController = async (mobileId) => {
  try {
    // Assuming mobileModel.findByIdAndDelete is used to delete the mobile listing
    await mobileModel.findByIdAndDelete(mobileId);
  } catch (error) {
    throw error; // Propagate the error to handle it in the calling route
  }
};
module.exports = { sellMobileController, getUserAddedMobilesController, deleteMobileController };


