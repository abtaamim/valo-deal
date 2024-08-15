const computerModel = require('../models/computersModel');
const mobileModel = require('../models/sellMobileModel')
const electronicModel = require('../models/electronicsModel')
const vehicleModel = require('../models/vehiclesModel');
const mobAcc = require('../models/mobileAccessoriesModel');
const User = require('../models/userModel')
const searchController = async (req, res) => {
  try {
    const { keyWord } = req.params;
    const computers = await computerModel.find(
      {
        $or: [
          { itemType: { $regex: keyWord, $options: "i" } },
          { subCategory: { $regex: keyWord, $options: "i" } },
          { brand: { $regex: keyWord, $options: "i" } },
          { model: { $regex: keyWord, $options: "i" } },
          { description: { $regex: keyWord, $options: "i" } }
        ]
      }
    )
    const vehicles = await vehicleModel.find(
      {
        $or: [
          { itemType: { $regex: keyWord, $options: "i" } },
          { subCategory: { $regex: keyWord, $options: "i" } },
          { brand: { $regex: keyWord, $options: "i" } },
          { model: { $regex: keyWord, $options: "i" } },
          { description: { $regex: keyWord, $options: "i" } }
        ]
      }
    )
    const mobiles = await mobileModel.find(
      {
        $or: [
          { itemType: { $regex: keyWord, $options: "i" } },
          { subCategory: { $regex: keyWord, $options: "i" } },
          { brand: { $regex: keyWord, $options: "i" } },
          { model: { $regex: keyWord, $options: "i" } },
          { description: { $regex: keyWord, $options: "i" } }
        ]
      }
    )
    const electronics = await electronicModel.find(
      {
        $or: [
          { itemType: { $regex: keyWord, $options: "i" } },
          { subCategory: { $regex: keyWord, $options: "i" } },
          { brand: { $regex: keyWord, $options: "i" } },
          { model: { $regex: keyWord, $options: "i" } },
          { description: { $regex: keyWord, $options: "i" } }
        ]
      }
    )
    const mobileAccs = await mobAcc.find(
      {
        $or: [
          { itemType: { $regex: keyWord, $options: "i" } },
          { subCategory: { $regex: keyWord, $options: "i" } },
          { brand: { $regex: keyWord, $options: "i" } },
          { model: { $regex: keyWord, $options: "i" } },
          { description: { $regex: keyWord, $options: "i" } },
          { accessoryType: { $regex: keyWord, $options: "i" } }
        ]
      }
    )
    const results =[...computers, ...electronics, ...mobiles, ...vehicles, ...mobileAccs]
    //res.json(results);
    res.status(200).json({ success: true, results });
  } catch (e) {
    console.error('Error searching for products:', e);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const postSearchedItems = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const { searchTerm } = req.body;
    
    // Push the new search item to the user's search history
    user.searchedItems.push({ searchTerm, searchedAt: new Date() });

    // Save the updated user document
    await user.save();
    
    // Send a success response
    res.status(200).json({ message: 'Search term added', searchedItems: user.searchedItems });
  } catch (error) { // Use 'error' here for consistency
    console.error('Error while searching:', error);
    res.status(500).json({ success: false, error });
  }
};
// const postSearch= async(req, res)=>{
//   try{
//     const userId = req.user._id; 
//     const user = await User.findById(userId);

    

//     user.searchedItems.push({ searchTerm: keyWord, searchedAt: new Date() });
//     await user.save();

//     res.status(201).json({ success: true, message: 'Item added to cart.', recentlyViewedItems: user.recentlyViewedItems });
//   } catch (error) {
//     console.error('Error adding item to recentlyviewed:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error', error });
//   }
// };

const getSearchedItems= async (req, res) => {
  console.log('called')
  try{
    const userId = req.user._id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    } 
    console.log("logitem: ",user.searchedItems)
    const searchedItems= await Promise.all (user.searchedItems.map(async(searchItem)=>{
      const searchTerm = searchItem.searchTerm;
      const searchedAt= searchItem.searchedAt;
      const id=searchItem._id
      return {searchTerm , searchedAt, id} ;
    }) )

    res.status(200).json({ success: true,  searchedItems});
  }catch(e){
    console.log(e);
  }
}
const removeFromSearch = async (req, res) => {
  
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    const itemId = req.params.itemId;

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.searchedItems = user.searchedItems.filter(
      (item) => item._id.toString() !== itemId
    );
    await user.save();
    res.status(200).json({ success: true, message: 'Item removed from history.', searchedItems: user.searchedItems });
  } catch (error) {
    console.error('Error removing item from historu:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};
module.exports ={removeFromSearch, searchController, postSearchedItems, getSearchedItems};