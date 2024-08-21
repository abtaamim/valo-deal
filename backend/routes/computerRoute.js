const express = require('express');
const{ computerController, getAllComputersController, getSubcatComputersController, getAddedComputer, deleteComputer, getLatestComputer}=require('../controllers/computerController');

const { requireSignIn } = require('../middlewares/authMiddleware');
const paginatedResults = require('../middlewares/paginationMiddleware');
const multer = require('multer');


const router = express.Router();

// Configure multer for file uploads

const storage = multer.memoryStorage();
const upload = multer({ storage });
// Sell product route
router.post('/computer', requireSignIn,upload.none(),computerController);
 
router.get('/computers/:subCategory', requireSignIn, getSubcatComputersController);
// Route to get user-specific omputers
router.get('/computers', requireSignIn, getAllComputersController);
router.get('/added-computers', requireSignIn, getAddedComputer);
router.get('/latest-computers', requireSignIn, getLatestComputer);
router.delete('/computer/:id', requireSignIn, async (req, res) => {
  try {
    const compId = req.params.id;
    await deleteComputer(compId);
    res.status(200).json({ success: true, message: 'computer deleted successfully' });
  } catch (error) {
    console.error('Error deleting mobile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
module.exports = router;
