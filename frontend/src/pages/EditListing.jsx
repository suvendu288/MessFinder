import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import listingService from "../services/listingService";
import Loading from "../components/Loading";

const EditListing = () => {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listing = await listingService.getListingById(id);
        setFormData({
          title: listing.title,
          description: listing.description,
          location: listing.location,
          collegeNearby: listing.collegeNearby,
          rent: listing.rent,
          roomType: listing.roomType,
          facilities: listing.facilities.join(", "),
          foodAvailable: listing.foodAvailable,
        });
        setExistingImages(listing.images || []);
      } catch (err) {
        setError("Failed to load listing details.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let newImages = [];

      if (imageFiles.length > 0) {
        const uploadResult = await listingService.uploadImages(imageFiles);
        newImages = uploadResult.images;
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
        images: [...existingImages, ...newImages],
      };

      await listingService.updateListing(id, listingPayload);
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Edit Listing</h2>
        <p className="auth-subtitle">Update the details of your mess/room facility.</p>

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

          {existingImages.length > 0 && (
            <div className="form-group">
              <label>Current Images</label>
              <div className="image-preview-grid">
                {existingImages.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img} alt={`Existing ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeExistingImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="images">Add More Images</label>
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
                <img key={index} src={url} alt={`New Preview ${index + 1}`} />
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
