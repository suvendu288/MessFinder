import { useState } from "react";
import { useNavigate } from "react-router-dom";
import listingService from "../services/listingService";

const AddListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    collegeNearby: "",
    rent: "",
    roomType: "Single",
    facilities: "",
    foodAvailable: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.location || !formData.collegeNearby || !formData.rent) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let images = [];

      if (imageFiles.length > 0) {
        const uploadResult = await listingService.uploadImages(imageFiles);
        images = uploadResult.images;
      }

      const facilitiesArray = formData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const listingPayload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        collegeNearby: formData.collegeNearby,
        rent: Number(formData.rent),
        roomType: formData.roomType,
        facilities: facilitiesArray,
        foodAvailable: formData.foodAvailable,
        images,
      };

      await listingService.createListing(listingPayload);
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Add New Listing</h2>
        <p className="auth-subtitle">Fill in the details of your mess/room facility.</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Comfortable Single Room near XYZ College"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the room, mess, amenities, and rules..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Area, City"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="collegeNearby">Nearby College *</label>
              <input
                type="text"
                id="collegeNearby"
                name="collegeNearby"
                value={formData.collegeNearby}
                onChange={handleChange}
                placeholder="College Name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rent">Rent (₹/month) *</label>
              <input
                type="number"
                id="rent"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Room Type *</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
              >
                <option value="Single">Single</option>
                <option value="Shared">Shared</option>
                <option value="Dormitory">Dormitory</option>
                <option value="Mess Only">Mess Only</option>
                <option value="Room + Mess">Room + Mess</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="facilities">Facilities (comma-separated)</label>
            <input
              type="text"
              id="facilities"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="WiFi, AC, Laundry, Parking"
            />
          </div>

          <div className="form-group form-checkbox">
            <input
              type="checkbox"
              id="foodAvailable"
              name="foodAvailable"
              checked={formData.foodAvailable}
              onChange={handleChange}
            />
            <label htmlFor="foodAvailable">Food/Mess Available</label>
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images (max 6)</label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="image-preview-grid">
              {previewUrls.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index + 1}`} />
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating Listing..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
