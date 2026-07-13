const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  collegeNearby: {
    type: String,
    required: [true, "Nearby college is required"],
  },
  rent: {
    type: Number,
    required: [true, "Rent is required"],
  },
  roomType: {
    type: String,
    enum: ["Single", "Shared", "Dormitory", "Mess Only", "Room + Mess"],
    required: [true, "Room type is required"],
  },
  facilities: {
    type: [String],
    default: [],
  },
  foodAvailable: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", listingSchema);
