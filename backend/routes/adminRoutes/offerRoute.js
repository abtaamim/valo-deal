const express = require('express');
const { createOffer, getActiveOffers, getOfferById, getInactiveOffers, updateOffer, softDeleteOffer } = require("../../controllers/adminController/offerController")
const {requireSignIn,isAdmin} = require("../../middlewares/authMiddleware")
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/create-offer", requireSignIn, isAdmin, upload.none(), createOffer)

router.get("/active-offers", requireSignIn, isAdmin, getActiveOffers);


router.get("/offer/:id", requireSignIn, isAdmin, getOfferById);

router.get("/inactive-offers", requireSignIn, isAdmin, getInactiveOffers);

router.put("/update-offer/:id", requireSignIn, isAdmin, updateOffer);

router.delete("/delete-offer/:id", requireSignIn, isAdmin, softDeleteOffer);

module.exports = router;