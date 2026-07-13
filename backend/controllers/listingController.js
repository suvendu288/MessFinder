const Listing = require("../models/Listing");

// @desc    Get all listings (with optional search/filter)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const { location, collegeNearby, roomType, minRent, maxRent, search } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (collegeNearby) {
      filter.collegeNearby = { $regex: collegeNearby, $options: "i" };
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { collegeNearby: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const listings = await Listing.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single listing by id
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get listings created by logged in owner
// @route   GET /api/listings/owner/my-listings
// @access  Private (Owner)
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Owner)
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      collegeNearby,
      rent,
      roomType,
      facilities,
      foodAvailable,
      images,
    } = req.body;

    if (!title || !description || !location || !collegeNearby || !rent || !roomType) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const listing = await Listing.create({
      title,
      description,
      location,
      collegeNearby,
      rent,
      roomType,
      facilities: facilities || [],
      foodAvailable: foodAvailable || false,
      images: images || [],
      owner: req.user._id,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private (Owner - must own the listing)
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    const updatableFields = [
      "title",
      "description",
      "location",
      "collegeNearby",
      "rent",
      "roomType",
      "facilities",
      "foodAvailable",
      "images",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    const updatedListing = await listing.save();

    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner - must own the listing)
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();

    res.status(200).json({ message: "Listing removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
};
