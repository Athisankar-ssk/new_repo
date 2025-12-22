import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters!");
      return;
    }

    try {
      await api.post("/auth/register", form);
      setMessage("Signup Successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="auth-bg"> {/* 🔥 IMPORTANT FIX */}
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account </h2>

        {message && <p className="msg">{message}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <button type="submit" className="btn-auth">
          Sign Up
        </button>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
