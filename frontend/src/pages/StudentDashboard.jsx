import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import listingService from "../services/listingService";
import ListingCard from "../components/ListingCard";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
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
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Browse and search for the perfect mess or room near your college.</p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading && <Loading />}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && listings.length === 0 && (
          <p className="no-results">No listings available right now. Check back soon!</p>
        )}

        <div className="listings-grid">
          {!loading &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
