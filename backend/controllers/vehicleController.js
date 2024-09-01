const vehicleModel=require('../models/vehiclesModel')

const vehicleController = async (req, res) => {
  try {
    const { sellerId, brand, model, subCategory,  description, price, imgUrl } = req.body;
    //const files = req.files;
    //const imagePaths = files.map(file => `/uploads/${file.filename}`);

    if (!sellerId || !brand || !model || !subCategory  || !description || !price || !imgUrl) {
      console.error('Validation failed:', { sellerId, brand, model, subCategory,  description, price,imgUrl });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newVehicle = new vehicleModel({
      sellerId,
      brand,
      model,
      subCategory,
      description,
      price,
      imgUrl
    });

    await newVehicle.save();
    console.log('Received data:', { sellerId, brand, model, subCategory, description, price, imgUrl });

    res.status(200).send('Product listed successfully');
  } catch (error) {
    console.error('Error listing product:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getAllVehiclesController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user

    // Fetch Vehicles where sellerId is not equal to userId
    const Vehicles = await vehicleModel.find({ sellerId: { $ne: userId } });

    if (Vehicles.length === 0) {
      return res.status(404).json({ success: false, message: 'No Vehicles found for the user' });
    }

    res.status(200).json({ success: true, Vehicles });
  } catch (error) {
    console.error('Error fetching user Vehicles:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const getAddedVehicle = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const vehicles = await vehicleModel.find({ sellerId: userId });
    res.status(200).json({ success: true, vehicles });
  } catch (error) {
    console.error('Error fetching user Vehicles:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getSubcatVehiclesController = async (req, res) => {
  try {
   // const userId = req.user._id; 
    const { subCategory } = req.params;
    const vehicles =await vehicleModel.find({subCategory: subCategory });//, sellerId: { $ne: userId } 
    if (vehicles.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    }
    res.status(200).json({ success: true, vehicles });
  }catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}


const deleteVehicle = async (VehicleId) => {
  try {
    // Assuming vehicleModel.findByIdAndDelete is used to delete the Vehicle listing
    await vehicleModel.findByIdAndDelete(VehicleId);
  } catch (error) {
    throw error; // Propagate the error to handle it in the calling route
  }
};

const getLatestVehicle = async (req, res) => {
  try {
    //const userId = req.user._id; 
    const latestVehicle = await vehicleModel.find()//{ sellerId: { $ne: userId } }
      .sort({ createdAt: -1 }) .exec();
     
    if (!latestVehicle) {
      return res.status(404).json({ success: false, message: 'No vehicles found' });
    }
    res.status(200).json({ success: true,  latestVehicle });
  } catch (error) {
    console.error('Error fetching the latest vehicle:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { vehicleController, getSubcatVehiclesController, getAllVehiclesController, getAddedVehicle, deleteVehicle, getLatestVehicle };


