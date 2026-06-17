import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";

import {
  FiMenu,
  FiX,
  FiGithub,
  FiUser,
  FiChevronDown,
  FiActivity,
} from "react-icons/fi";
import { RiScan2Line } from "react-icons/ri";
import { IoHandRightOutline } from "react-icons/io5";
import { BiRadar } from "react-icons/bi";
import { FaUser,FaSignOutAlt } from "react-icons/fa";
import "../Style/Navbar.scss";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
const [profileOpen, setProfileOpen] = useState(false);
const {user, loading, handlelogout,} = useAuth()


  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Smooth Redirect Handler using HTML5 View Transitions API
  const handleSmoothNavigate = (to, e) => {
    e.preventDefault();
    closeMenu();

    // Check if browser supports View Transitions API for ultra-smooth layout morphing
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(to);
      });
    } else {
      navigate(to);
    }
  };



async function logoutHandler() {
  try {
    await handlelogout();

    navigate("/");
  } catch (error) {
    console.log(error);
  }
}
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* LEFT: BRAND LOGO */}
        <Link
          to="/"
          className="logo"
          onClick={(e) => handleSmoothNavigate("/", e)}
        >
          <span className="brand-primary">Lexar</span>
          <span className="brand-secondary">Tracker</span>
        </Link>

        {/* CENTER: NAVIGATION LINKS */}
        <nav className={`nav-links ${menuOpen ? "mobile-active" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={(e) => handleSmoothNavigate("/", e)}
          >
            Home
          </NavLink>

          {/* TRACKERS DROPDOWN */}
          <div
            className="dropdown-wrapper"
            onClick={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`nav-item dropdown-trigger ${dropdownOpen ? "active" : ""}`}
            >
              <span>Trackers</span>
              <FiChevronDown
                size={14}
                className={`chevron ${dropdownOpen ? "rotate" : ""}`}
              />
            </button>

            <div className={`dropdown-panel ${dropdownOpen ? "show" : ""}`}>
              <Link
                to="/facetracker"
                className="dropdown-link"
                onClick={(e) => handleSmoothNavigate("/facetracker", e)}
              >
                <RiScan2Line size={16} />
                <span>Face Tracker</span>
              </Link>
              <Link
                to="/bodytracker"
                className="dropdown-link"
                onClick={(e) => handleSmoothNavigate("/bodytracker", e)}
              >
                <FiActivity size={16} />
                <span>Body Tracker</span>
              </Link>
              <Link
                to="/handtracker"
                className="dropdown-link"
                onClick={(e) => handleSmoothNavigate("/handtracker", e)}
              >
                <IoHandRightOutline size={16} />
                <span>Hand Tracker</span>
              </Link>
              <Link
                to="/motiontracker"
                className="dropdown-link"
                onClick={(e) => handleSmoothNavigate("/motiontracker", e)}
              >
                <BiRadar size={16} />
                <span>Motion Tracker</span>
              </Link>
            </div>
          </div>

          <NavLink
            to="/features"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={(e) => handleSmoothNavigate("/features", e)}
          >
            Features
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={(e) => handleSmoothNavigate("/contact", e)}
          >
            Contact
          </NavLink>
        </nav>

        {/* RIGHT: EXTERNAL UTILITY ICONS */}
        <div className={`nav-actions ${menuOpen ? "mobile-active" : ""}`}>
          <a
            href="https://github.com/LexarCoder"
            target="_blank"
            rel="noreferrer"
            className="action-icon-btn"
            title="GitHub Repository"
          >
            <FiGithub size={19} />
          </a>
          {user ? (
            <div className="profile-dropdown">
              <div
                className="profile-avatar"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>
                    <FaUser />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      logoutHandler();
                      setProfileOpen(false);
                    }}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="action-icon-btn" title="Login">
              <FiUser size={19} />
            </Link>
          )}
        </div>


        {/* MOBILE ACTIONS */}
        <div className="mobile-header-actions">
          {user ? (
            <div className="mobile-profile-dropdown">
              <div
                className="mobile-profile-avatar"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              {profileOpen && (
                <div className="mobile-dropdown-menu">
                  <Link
                    to="/profile"
                    onClick={() => {
                      setProfileOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <FaUser />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      logoutHandler();
                      setProfileOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="mobile-login-btn">
              <FiUser size={18} />
            </Link>
          )}

          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
