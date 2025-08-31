const Product = require("../../models/product")
const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      deleted_at: null,
      product_status: 'pending'
    }).populate('category_id').populate('seller_id', 'email');

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const changeProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { product_status: status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports={changeProductStatus, getPendingProducts}