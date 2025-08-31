const ProductCategory = require('../models/productCategory');

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await ProductCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new ProductCategory({
      name,
      parent_id: parent_id || null
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getParentCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ parent_id: null, deleted_at: null });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getChildCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ parent_id: req.params.parent_id , deleted_at: null });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getCategoryTree = async (req, res) => {
  try {
    // Fetch all categories in one go
    const categories = await ProductCategory.find({ deleted_at: null });

    // Build tree
    const categoryTree = categories
      .filter(cat => !cat.parent_id) // Only parents
      .map(parent => ({
        id: parent._id,
        name: parent.name,
        children: categories
          .filter(child => String(child.parent_id) === String(parent._id))
          .map(child => ({
            id: child._id,        
            name: child.name
          }))
      }));

    res.status(200).json(categoryTree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ deleted_at: null });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category || category.deleted_at) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;

    const category = await ProductCategory.findById(req.params.id);
    if (!category || category.deleted_at) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (parent_id !== undefined) category.parent_id = parent_id;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete category
const softDeleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category || category.deleted_at) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.deleted_at = new Date();
    await category.save();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
  getParentCategories,
  getChildCategories,
  getCategoryTree
};
