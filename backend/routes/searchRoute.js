const express= require('express');
const router= express.Router();
const {requireSignIn}= require('../middlewares/authMiddleware');
const {postSearch, searchController, postSearchedItems, getSearchedItems, removeFromSearch}= require('../controllers/searchController')
router.get('/:keyWord', searchController)

router.delete('/delete/:itemId',requireSignIn, removeFromSearch);
router.get('/fetch/searched-items', requireSignIn, getSearchedItems);
router.post('/searched-items', requireSignIn, postSearchedItems);

module.exports=router;