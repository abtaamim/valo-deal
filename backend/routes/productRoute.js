const express = require('express');
const {
  createProduct,
  getActiveProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  getSellerProducts
} = require('../controllers/productController');
const {changeProductStatus, getPendingProducts} = require('../controllers/adminController/productManage')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', requireSignIn,upload.none(), createProduct);
router.get('/active', getActiveProducts);
router.get('/my-products', requireSignIn, getSellerProducts);
router.put('/update/:id', requireSignIn, updateProduct);
router.delete('/delete/:id', requireSignIn, softDeleteProduct);
router.put('/change-status/:id', requireSignIn, isAdmin, changeProductStatus);
router.get('/pending', requireSignIn, isAdmin, getPendingProducts);
router.get('/:id', getProductById);
module.exports = router;
