const express = require('express');
const { sellMobileController, getUserAddedMobilesController, deleteMobileController } = require('../controllers/sellMobileController');
const { requireSignIn } = require('../middlewares/authMiddleware');
//const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// Sell product route
// router.post('/mobiles', requireSignIn, upload.array('images', 5), (req, res, next) => {
//   console.log('Received request:');
//   console.log('Body:', req.body);
//   console.log('Files:', req.files);
  
//   sellMobileController(req, res, next);
// });

router.post('/mobiles', requireSignIn, sellMobileController);

// router.post('/mobiles', requireSignIn, (req, res, next) => {
//   console.log('Received request:');
//   console.log('Body:', req.body);
  
//   sellMobileController(req, res, next);
// });


// Route to get user-specific mobiles
router.get('/mobiles', requireSignIn, getUserAddedMobilesController);
router.delete('/mobiles/:id', requireSignIn, async (req, res) => {
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
