const express = require('express');
const{ electronicController, getAllEletronicsController, getSubcatElectronisController, getAddedElectronic, deleteElectronic, getLatestElectronic}=require('../controllers/electronicController');

const { requireSignIn } = require('../middlewares/authMiddleware');
const multer = require('multer');


const router = express.Router();

// Configure multer for file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage });
// Sell product route
router.post('/electronic', requireSignIn,upload.none(),electronicController);
 
router.get('/electronics/:subCategory', requireSignIn, getSubcatElectronisController);
// Route to get user-specific omputers
router.get('/electronics', requireSignIn, getAllEletronicsController);
router.get('/added-electronics', requireSignIn, getAddedElectronic);
router.get('/latest-electronics', requireSignIn, getLatestElectronic);
router.delete('/electronics/:id', requireSignIn, async (req, res) => {
  try {
    const compId = req.params.id;
    await deleteElectronic(compId);
    res.status(200).json({ success: true, message: 'computer deleted successfully' });
  } catch (error) {
    console.error('Error deleting mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
module.exports = router;
