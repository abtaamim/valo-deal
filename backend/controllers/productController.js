const Product = require("../models/product")
const ProductCategory = require("../models/productCategory")
// Create product (seller or admin)
const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      brand,
      category_id,
      price,
      stock,
      condition,
      img_urls
    } = req.body;

    const newProduct = new Product({
      seller_id: req.user._id,
      product_name,
      product_description,
      brand,
      category_id,
      price,
      stock,
      condition,
      img_urls
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all active products
const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({
      deleted_at: null,
      product_status: 'approved'
    }).populate('category_id').populate('seller_id', 'name email');

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      deleted_at: null,
      product_status: 'approved'
    }).populate('category_id').populate('seller_id', 'name email');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product (by seller or admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, deleted_at: null },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete product
const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product.seller_id!=req.user._id){
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check status before deleting
    if (product.status != "pending") {
      return res.status(400).json({ message: "Cannot delete a sold or approved product" });
    }

    // Mark as deleted
    product.deleted_at = new Date();
    await product.save();
    // await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const categoryBasedProduct = async (req, res) => {
  const catId = req.params.id
  try {
    const prod_cat = await ProductCategory.findOne({ _id: catId })
    if (prod_cat.parent_id !== null) {
      const products = await Product.find({ category_id: catId, product_status: 'approved' })
      res.status(200).json(products)
    }
    else {
      const child_cats = await ProductCategory.find({ parent_id: prod_cat._id });
      const productPromises = child_cats.map(cat =>
        Product.find({ category_id: cat._id, product_status: 'approved' })
      );
      const productsByCategory = await Promise.all(productPromises);
      const allProducts = productsByCategory.flat();
      return res.status(200).json(allProducts);

      // const child_cats = await ProductCategory.find({ parent_id: prod_cat })
      // for (const child_cat of child_cats) {
      //   const products = await Product.find({ category_id: child_cat._id,product_status:'active' })
      //   res.status(200).json(products)
      // }      
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
}

// Get all products by a seller (their own)
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller_id: req.user._id,
      deleted_at: null
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: change product status


module.exports = {
  createProduct,
  getActiveProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  getSellerProducts,
  categoryBasedProduct
};
