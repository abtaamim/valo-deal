const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
  getParentCategories,
  getChildCategories,
  getCategoryTree
} = require('../controllers/categoryConteroller');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

router.post('/add-category', requireSignIn, isAdmin, createCategory);

router.get('/parent-cat', getParentCategories);
router.get('/child-cat/:parent_id', getChildCategories);
router.get('/category-tree', getCategoryTree)
router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.put('/:id', requireSignIn, isAdmin, updateCategory);

router.delete('/:id', requireSignIn, isAdmin, softDeleteCategory);


module.exports = router;
