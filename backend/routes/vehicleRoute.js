const express = require('express');
const{  vehicleController, getSubcatVehiclesController, getAllVehiclesController, getAddedVehicle, deleteVehicle, getLatestVehicle}=require('../controllers/vehicleController');

const { requireSignIn } = require('../middlewares/authMiddleware');
const multer = require('multer');


const router = express.Router();

// Configure multer for file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/vehicles/:subCategory',  getSubcatVehiclesController);
router.post('/vehicle', requireSignIn,upload.none(),vehicleController);
 

// Route to get user-specific omputers
router.get('/vehicles', requireSignIn, getAllVehiclesController);
router.get('/added-vehicles', requireSignIn, getAddedVehicle);

router.get('/latest-vehicles',  getLatestVehicle); //for HomePage
router.delete('/vehicle/:id', requireSignIn, async (req, res) => {
  try {
    const compId = req.params.id;
    await deleteVehicle(compId);
    res.status(200).json({ success: true, message: 'computer deleted successfully' });
  } catch (error) {
    console.error('Error deleting mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
