import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🏠</span> MessFinder
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn-nav" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}

          {user && user.role === "student" && (
            <Link to="/student-dashboard" onClick={closeMenu}>
              Dashboard
            </Link>
          )}

          {user && user.role === "owner" && (
            <>
              <Link to="/owner-dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/add-listing" onClick={closeMenu}>
                Add Listing
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" onClick={closeMenu}>
                Profile
              </Link>
              <button className="btn-nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
