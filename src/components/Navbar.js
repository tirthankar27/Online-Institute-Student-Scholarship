import React from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo3.png";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(props) {
  const location = useLocation();
  const role = localStorage.getItem("role"); // 'student', 'staff', or 'admin'

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    props.setUsername(null);
    window.location.href = "/scholarship/login";
  };

  const getNavLinkClass = (path) =>
    `nav-link fs-4 ${
      location.pathname === path ? "text-danger fw-bold" : "text-dark"
    }`;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              width="200"
              height="140"
              className="d-inline-block align-text-top"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {/* Common Links */}
              <li className="nav-item">
                <Link className={getNavLinkClass("/")} to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/schemes")} to="/schemes">Schemes</Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/how-to-apply")} to="/how-to-apply">How to Apply</Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/about")} to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/support")} to="/support">Support</Link>
              </li>

              {/* Student-only Links */}
              {props.username && role === "student" && (
                <>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/apply")} to="/apply">Apply for Scholarship</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/my-applications")} to="/my-applications">My Applications</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/documents")} to="/documents">Documents</Link>
                  </li>
                </>
              )}

              {/* Staff-only Links */}
              {props.username && role === "staff" && (
                <>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/review")} to="/review">Review Applications</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/notifications")} to="/notifications">Notifications</Link>
                  </li>
                </>
              )}

              {/* Admin-only Links */}
              {props.username && role === "admin" && (
                <>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/dashboard")} to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/manage-scholarships")} to="/manage-scholarships">Manage Scholarships</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/reports")} to="/reports">Reports</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={getNavLinkClass("/user-management")} to="/user-management">User Management</Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
              {props.username ? (
                <>
                  <span className="nav-link fs-5 text-dark">
                    Welcome, {props.username} {role && `(${role})`}
                  </span>
                  <button
                    className="btn btn-danger fs-6 py-2 px-3 fw-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className={getNavLinkClass("/login")}
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="btn btn-danger fs-5 py-2 px-3 fw-semibold"
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  username: PropTypes.string,
  setUsername: PropTypes.func,
};