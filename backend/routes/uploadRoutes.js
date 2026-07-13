const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImages } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, upload.array("images", 6), uploadImages);

module.exports = router;
