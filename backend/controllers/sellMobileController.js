const path = require('path');

// Define predefined images (you may need to adjust the path based on your project structure)
const predefinedImages = [
  path.join(__dirname, '..', 'public', 'assets', 'images', 'phn1.jpg'),
  path.join(__dirname, '..', 'public', 'assets', 'images', 'phn2.jpg'),
  path.join(__dirname, '..', 'public', 'assets', 'images', 'phn3.jpg'),
];


const mobileModel = require('../models/sellMobileModel');

const sellMobileController = async (req, res) => {
  try {
    const { sellerId, brand, model, condition, authenticity, description, price } = req.body;
    
    if (!sellerId || !brand || !model || !condition || !authenticity || !description || !price) {
      console.log('Validation failed:', { sellerId, brand, model, condition, authenticity, description, price });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const selectedImage = predefinedImages[Math.floor(Math.random() * predefinedImages.length)];

    const newMobile = new mobileModel({
      sellerId,
      brand,
      model,
      condition,
      authenticity,
      description,
      price,
      images: [selectedImage],
    });

    await newMobile.save();
    console.log('Received data:', { sellerId, brand, model, condition, authenticity, description, price, images: [selectedImage] });

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

// const deleteMobileController = async (req, res) => {
//   const { mobileId } = req.params; // Get mobileId from request params
//   try {
//     await mobileModel.findByIdAndDelete(mobileId);
//     res.status(200).json({ success: true, message: 'Mobile listing deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting mobile:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

module.exports = { sellMobileController, getUserAddedMobilesController, deleteMobileController };
