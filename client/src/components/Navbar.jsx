import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // Don't show navbar if not logged in? Or show simplified?

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <div>
          <strong style={{ fontSize: "1.25rem" }}>Store Rating</strong>
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="nav-link"
              style={{ marginLeft: "1rem" }}
            >
              Admin
            </Link>
          )}
          {user.role === "normal" && (
            <Link
              to="/dashboard"
              className="nav-link"
              style={{ marginLeft: "1rem" }}
            >
              Stores
            </Link>
          )}
          {user.role === "store_owner" && (
            <Link
              to="/owner"
              className="nav-link"
              style={{ marginLeft: "1rem" }}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-secondary">
            Hello, <strong>{user.name}</strong>{" "}
            <span className="badge badge-primary">{user.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="secondary"
            style={{ padding: "0.5rem 1rem" }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
