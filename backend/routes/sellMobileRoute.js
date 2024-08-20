const express = require('express');
const { sellMobileController,getAllMobilesController, getLatestMobile, getUserAddedMobilesController, deleteMobileController } = require('../controllers/sellMobileController');
const { requireSignIn } = require('../middlewares/authMiddleware');

const multer = require('multer');
const router = express.Router();
// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Sell product route
router.post('/mobile', requireSignIn,upload.none(),sellMobileController);
// Route to get user-specific mobiles
router.get('/mobiles', requireSignIn, getUserAddedMobilesController);
router.get('/latest-mobiles', requireSignIn, getLatestMobile);
router.get('/mobiles/:subCategory', requireSignIn, getAllMobilesController);
router.delete('/mobile/:id', requireSignIn, async (req, res) => {
  try {
    const mobileId = req.params.id;
    await deleteMobileController(mobileId);
    res.status(200).json({ success: true, message: 'Mobile deleted successfully' });
  } catch (error) {
    console.error('Error deleting mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
module.exports = router;