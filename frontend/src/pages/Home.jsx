import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import listingService from "../services/listingService";
import ListingCard from "../components/ListingCard";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await listingService.getListings(filters);
      setListings(data);
      setError("");
    } catch (err) {
      setError("Failed to load listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (filters) => {
    fetchListings(filters);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Mess & Room Near College</h1>
          <p>
            MessFinder connects students with verified mess and room owners
            near their colleges. Search, compare, and connect — all in one
            place.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <a href="#listings" className="btn btn-outline-white btn-large">
              Browse Listings
            </a>
          </div>
        </div>
      </section>

      <section className="search-section" id="listings">
        <div className="container">
          <h2>Available Listings</h2>
          <SearchBar onSearch={handleSearch} />

          {loading && <Loading />}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && listings.length === 0 && (
            <p className="no-results">
              No listings found. Try adjusting your search filters.
            </p>
          )}

          <div className="listings-grid">
            {!loading &&
              listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose MessFinder?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Easy Search</h3>
              <p>Filter listings by location, college, and room type in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Owners</h3>
              <p>Connect directly with registered mess and room owners.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Real Photos</h3>
              <p>View actual images of rooms and facilities before you decide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Direct Contact</h3>
              <p>Reach out to owners directly through contact details on each listing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
