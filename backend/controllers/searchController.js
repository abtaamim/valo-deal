const Product = require("../models/product");
const User = require("../models/userModel");

// 🔎 Search products
const searchController = async (req, res) => {
  try {
    const { keyWord } = req.params;

    const searchQuery = {
      $or: [
        { product_name: { $regex: keyWord, $options: "i" } },
        { product_description: { $regex: keyWord, $options: "i" } },
        { brand: { $regex: keyWord, $options: "i" } },
      ],
      product_status: { $ne: "stock_out" }, // exclude stock_out
      deleted_at: null, // exclude deleted
    };

    const results = await Product.find(searchQuery).lean();

    res.status(200).json({ success: true, results });
  } catch (e) {
    console.error("Error searching for products:", e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 📝 Save searched term to user history
const postSearchedItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { searchTerm } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.searchedItems.push({ searchTerm, searchedAt: new Date() });
    await user.save();

    res.status(200).json({ message: "Search term added", searchedItems: user.searchedItems });
  } catch (error) {
    console.error("Error while searching:", error);
    res.status(500).json({ success: false, error });
  }
};

// 📜 Get user search history
const getSearchedItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const searchedItems = user.searchedItems.map((searchItem) => ({
      id: searchItem._id,
      searchTerm: searchItem.searchTerm,
      searchedAt: searchItem.searchedAt,
    }));

    res.status(200).json({ success: true, searchedItems });
  } catch (e) {
    console.error("Error getting searched items:", e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ❌ Remove search history items
const removeFromSearch = async (req, res) => {
  try {
    const userId = req.user._id;
    const { selectedForDelete } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.searchedItems = user.searchedItems.filter(
      (item) => !selectedForDelete.includes(item._id.toString())
    );

    await user.save();
    res.status(200).json({ success: true, message: "Item(s) removed.", searchedItems: user.searchedItems });
  } catch (error) {
    console.error("Error removing search history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

module.exports = {
  searchController,
  postSearchedItems,
  getSearchedItems,
  removeFromSearch,
};
