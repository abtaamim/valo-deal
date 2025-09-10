const Offer = require("../../models/offer")


// Create a new offer
const createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      category_ids,
      img_urls,
      discount,
      starting_at,
      ending_at
    } = req.body;

    const newOffer = new Offer({
      title,
      description,
      category_ids,
      img_urls,
      discount,
      starting_at,
      ending_at
    });
    console.log(req.user.role)
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all active offers (not soft-deleted and not expired)
const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      deleted_at: null,
      ending_at: { $gt: new Date() }
    }).sort({ starting_at: -1 });

    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single offer by ID
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer || offer.deleted_at) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update offer
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    res.status(200).json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete offer
const softDeleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    res.status(200).json({ message: 'Offer soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Get deleted or expired offers
const getInactiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      $or: [
        { deleted_at: { $ne: null } },
        { ending_at: { $lte: new Date() } }
      ]
    }).sort({ ending_at: -1 });

    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createOffer, getActiveOffers, getOfferById, getInactiveOffers, updateOffer, softDeleteOffer}