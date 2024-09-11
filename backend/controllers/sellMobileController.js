const mobileModel=require('../models/sellMobileModel')
const gsmarena = require('gsmarena-api');
const sellMobileController = async (req, res) => {
  try {
    const { sellerId, brand, model, condition, authenticity, description, price, imgUrl } = req.body;
    //const files = req.files;
    //const imagePaths = files.map(file => `/uploads/${file.filename}`);

    if (!sellerId || !brand || !model || !condition || !authenticity || !description || !price || !imgUrl) {
      console.error('Validation failed:', { sellerId, brand, model, condition, authenticity, description, price,imgUrl });
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
      imgUrl
    });

    await newMobile.save();
    console.log('Received data:', { sellerId, brand, model, condition, authenticity, description, price, imgUrl });

    res.status(200).send('Product listed successfully');
  } catch (error) {
    console.error('Error listing product:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getAllMobilesController = async (req, res) => {
  try {
   // const userId = req.user._id; // Assuming user ID is available in req.user

    // Fetch mobiles where sellerId is not equal to userId
    const mobiles = await mobileModel.find();//{ sellerId: { $ne: userId } }

    // if (mobiles.length === 0) {
    //   return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    // }

    res.status(200).json({ success: true, mobiles });
  } catch (error) {
    console.error('Error fetching user mobiles:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


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

const getLatestMobile = async (req, res) => {
  try {
   // const userId = req.user._id; 
    //console.log(req.user);
    const latestMobile = await mobileModel.find()//{ sellerId:  {$ne: userId } }
      // .sort({ createdAt: -1 }).exec();
     
    if (!latestMobile) {
      return res.status(404).json({ success: false, message: 'No Mobiles found' });
    }
    res.status(200).json({ success: true,  latestMobile });
  } catch (error) {
    console.error('Error fetching the latest Mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getgsmBrand = async(req, res)=>{
  try{
  const brands = await gsmarena.catalog.getBrands();
  //console.log(brands);
  res.status(200).json({ success: true, brands });
  }catch(error){
    console.log("Error gsm: ",error);
  }
}
const getgsmModel =async(req, res)=>{
  try{
    const brand = req.params.brandId;
    //const models = await gsmarena.catalog.getModels(brand);
    const models = await gsmarena.catalog.getBrand(brand);
    res.status(200).json({ success: true, models });
  }catch(error){
    console.log("Error gsm: ",error);
  }
}
module.exports = {getgsmBrand, getgsmModel, sellMobileController, getAllMobilesController, getUserAddedMobilesController, deleteMobileController, getLatestMobile };

