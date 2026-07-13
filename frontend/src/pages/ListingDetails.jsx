import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import listingService from "../services/listingService";
import Loading from "../components/Loading";

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await listingService.getListingById(id);
        setListing(data);
      } catch (err) {
        setError("Listing not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p className="error-text container">{error}</p>;
  if (!listing) return null;

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : ["https://via.placeholder.com/700x450?text=No+Image+Available"];

  return (
    <div className="details-page">
      <div className="container">
        <Link to="/" className="back-link">
          ← Back to Listings
        </Link>

        <div className="details-grid">
          <div className="details-gallery">
            <div className="details-main-image">
              <img src={images[activeImage]} alt={listing.title} />
            </div>
            {images.length > 1 && (
              <div className="details-thumbnails">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={index === activeImage ? "active-thumb" : ""}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="details-info">
            <h1>{listing.title}</h1>
            <span className="details-badge">{listing.roomType}</span>

            <p className="details-location">📍 {listing.location}</p>
            <p className="details-college">🎓 Near {listing.collegeNearby}</p>
            <p className="details-rent">₹{listing.rent} / month</p>

            {listing.foodAvailable && (
              <p className="details-food">🍽️ Food/Mess Available</p>
            )}

            {listing.facilities && listing.facilities.length > 0 && (
              <div className="details-facilities">
                <h3>Facilities</h3>
                <div className="facilities-tags">
                  {listing.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="details-description">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            <div className="contact-section">
              {!showContact ? (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setShowContact(true)}
                >
                  Contact Owner
                </button>
              ) : (
                <div className="contact-card">
                  <h3>Owner Contact Details</h3>
                  <p>
                    <strong>Name:</strong> {listing.owner?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {listing.owner?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {listing.owner?.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
