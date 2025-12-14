import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">MyApp</div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink to="/" className="nav-item">Home</NavLink>
        <NavLink to="/profile" className="nav-item">Profile</NavLink>
        <NavLink to="/tasks" className="nav-item">Tasks</NavLink>
        <NavLink to="/settings" className="nav-item">Settings</NavLink>

        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* Mobile Menu Button */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>
    </nav>
  );
}
