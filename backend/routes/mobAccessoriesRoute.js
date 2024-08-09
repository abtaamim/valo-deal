const express = require('express');
const { mobAccessoriesCont, getAllMobAccessories, getAddedMobileAccessories, deleteMobileAccessories, getLatestMobileAccesories } = require('../controllers/mobileAccessoriesCont');
const { requireSignIn } = require('../middlewares/authMiddleware');

const multer = require('multer');
const { getLatestMobile } = require('../controllers/sellMobileController');
const router = express.Router();
// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Sell product route
router.post('/mobile-accessories', requireSignIn,upload.none(),mobAccessoriesCont);
// Route to get user-specific mobiles
router.get('/mobile-accessories', requireSignIn, getAddedMobileAccessories);
router.get('/latest-mobile-accessories', requireSignIn, getLatestMobile);
router.delete('/mobile-accessories/:id', requireSignIn, async (req, res) => {
  try {
    const mobileId = req.params.id;
    await deleteMobileAccessories(mobileId);
    res.status(200).json({ success: true, message: 'Mobile deleted successfully' });
  } catch (error) {
    console.error('Error deleting mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
module.exports = router;
