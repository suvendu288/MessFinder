import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import listingService from "../services/listingService";
import Loading from "../components/Loading";

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const data = await listingService.getMyListings();
      setListings(data);
      setError("");
    } catch (err) {
      setError("Failed to load your listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      await listingService.deleteListing(id);
      setListings(listings.filter((l) => l._id !== id));
      setDeleteMsg("Listing deleted successfully.");
      setTimeout(() => setDeleteMsg(""), 3000);
    } catch (err) {
      setError("Failed to delete listing.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your mess/room listings from here.</p>
          <Link to="/add-listing" className="btn btn-primary">
            + Add New Listing
          </Link>
        </div>

        {deleteMsg && <p className="success-text">{deleteMsg}</p>}
        {loading && <Loading />}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && listings.length === 0 && (
          <p className="no-results">
            You haven't added any listings yet. Click "Add New Listing" to get started.
          </p>
        )}

        <div className="owner-listings-table">
          {!loading &&
            listings.map((listing) => (
              <div className="owner-listing-row" key={listing._id}>
                <img
                  src={
                    listing.images && listing.images.length > 0
                      ? listing.images[0]
                      : "https://via.placeholder.com/100x80?text=No+Image"
                  }
                  alt={listing.title}
                  className="owner-listing-thumb"
                />
                <div className="owner-listing-info">
                  <h3>{listing.title}</h3>
                  <p>
                    📍 {listing.location} | 🎓 {listing.collegeNearby}
                  </p>
                  <p>₹{listing.rent}/month • {listing.roomType}</p>
                </div>
                <div className="owner-listing-actions">
                  <Link to={`/listings/${listing._id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                  <Link to={`/edit-listing/${listing._id}`} className="btn btn-primary btn-sm">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(listing._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
