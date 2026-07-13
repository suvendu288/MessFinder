import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : "https://via.placeholder.com/400x250?text=No+Image+Available";

  return (
    <div className="listing-card">
      <div className="listing-card-image">
        <img src={imageUrl} alt={listing.title} />
        <span className="listing-card-badge">{listing.roomType}</span>
      </div>

      <div className="listing-card-body">
        <h3>{listing.title}</h3>
        <p className="listing-card-location">📍 {listing.location}</p>
        <p className="listing-card-college">🎓 Near {listing.collegeNearby}</p>

        <div className="listing-card-footer">
          <span className="listing-card-rent">₹{listing.rent}/month</span>
          {listing.foodAvailable && (
            <span className="listing-card-food">🍽️ Food Available</span>
          )}
        </div>

        <Link to={`/listings/${listing._id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
