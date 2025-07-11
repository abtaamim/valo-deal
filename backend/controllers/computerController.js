const computerModel = require('../models/computersModel');

const computerController = async (req, res) => {
  try {
    const { sellerId, subCategory, brand, model, condition, description, price, imgUrl } = req.body;

    if (!sellerId || !brand || !model || !condition || !subCategory || !description || !price || !imgUrl) {
      console.error('Validation failed:', { sellerId, brand, model, condition, authenticity, description, price, imgUrl });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newComputer = new computerModel({
      sellerId,
      brand,
      model,
      condition,
      subCategory,
      description,
      price,
      imgUrl
    });

    await newComputer.save();
    //console.log('Received data:', { sellerId, brand, model, condition, subCategory, description, price, imgUrl });

    res.status(200).send('Product listed successfully');
  } catch (error) {
    console.error('Error listing product:', error);
    res.status(500).send('Internal Server Error');
  }
};

const waitingComputer = async (req, res) => {

}

const getAllComputersController = async (req, res) => {
  try {
    const userId = req.user._id;
    const computers = await computerModel.find({ sellerId: { $ne: userId }, sold: false, request: 'accepted' });

    if (computers.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    }

    res.status(200).json({ success: true, computers });
  } catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getSubcatComputersController = async (req, res) => {
  try {
    //const userId = req.user._id; 
    const subCategory = req.params.subCategory;
    const computers = await computerModel.find({ subCategory: subCategory, sold: false, request: 'accepted' });//, sellerId: { $ne: userId } 
    if (computers.length === 0) {
      return res.status(404).json({ success: false, message: 'No mobiles found for the user' });
    }

    res.status(200).json({ success: true, computers });
  } catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getAddedComputer = async (req, res) => {
  try {
    const userId = req.user._id;
    const computers = await computerModel.find({ sellerId: userId, sold: false });

    // if (computers.length === 0) {
    //   return res.status(404).json({ success: false, message: 'No computer found for the user' });
    // }

    res.status(200).json({ success: true, computers });
  } catch (error) {
    console.error('Error fetching computer product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const deleteComputer = async (compId) => {
  try {
    await computerModel.findByIdAndDelete(compId);

  } catch (error) {
    console.error('Error deleting computer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getLatestComputer = async (req, res) => {
  try {
    //const userId = req.user._id; 
    const latestComputer = await computerModel.find({ sold: false, request: 'accepted' })//{ sellerId: {$ne:userId}  }
      .sort({ createdAt: -1 }).limit(6).exec();

    if (!latestComputer) {
      return res.status(404).json({ success: false, message: 'No Computers found' });
    }
    res.status(200).json({ success: true, latestComputer });
  } catch (error) {
    console.error('Error fetching the latest Computer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getUnacceptedComputer = async (req, res) => {
  try {
    const comp = await computerModel.find({ request: 'unaccepted' });
    res.status(200).json({ success: true, computers: comp });
  } catch (e) {
    console.error('Error fetching unaccepted Computers:', error);
    res.status(500).json({ success: false, message: 'error fetching unaccepted computers' });
  }
}
const acceptComputer = async (req, res) => {
  try {
    const id = req.params.id;
    const comp = await computerModel.findByIdAndUpdate(id, { request: 'accepted' });
    res.status(200).json({ success: true, message: 'Computer accepted successfully' });
  } catch (e) {
    console.error('Error accepting computer:', error);
    res.status(500).json({ success: false, message: 'Error accepting computer' });
  }
}
module.exports = { getUnacceptedComputer, computerController, getAllComputersController, getSubcatComputersController, getAddedComputer, deleteComputer, getLatestComputer };