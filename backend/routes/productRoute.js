const express = require('express');
const {
  createProduct,
  getActiveProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  getSellerProducts
} = require('../controllers/productController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', requireSignIn,upload.none(), createProduct);
router.get('/active', getActiveProducts);
router.get('/:id', getProductById);
router.put('/update/:id', requireSignIn, updateProduct);
router.delete('/delete/:id', requireSignIn, softDeleteProduct);
router.get('/my-products', requireSignIn, getSellerProducts);
// router.put('/change-status/:id', requireSignIn, isAdmin, changeProductStatus);

module.exports = router;
