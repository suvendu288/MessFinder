// @desc    Upload one or more images
// @route   POST /api/upload
// @access  Private
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePaths = req.files.map((file) => `/uploads/${file.filename}`);

    res.status(200).json({
      message: "Files uploaded successfully",
      images: filePaths,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadImages };
