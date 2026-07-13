import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import Loading from "../components/Loading";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-avatar">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.name?.charAt(0)}
          </div>

          <h2>{profile?.name || user?.name}</h2>
          <span className="profile-role-badge">{profile?.role || user?.role}</span>

          {error && <p className="error-text">{error}</p>}

          <div className="profile-details">
            <div className="profile-detail-row">
              <span className="profile-label">Email</span>
              <span>{profile?.email || user?.email}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-label">Phone</span>
              <span>{profile?.phone || user?.phone}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-label">Account Type</span>
              <span style={{ textTransform: "capitalize" }}>
                {profile?.role || user?.role}
              </span>
            </div>
            {profile?.createdAt && (
              <div className="profile-detail-row">
                <span className="profile-label">Member Since</span>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
