import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login Successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-bg"> {/* 🔥 THIS LINE FIXES UI */}
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome Back 👋</h2>

        {message && <p className="msg">{message}</p>}

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
          placeholder="Password"
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <button type="submit" className="btn-auth">
          Login
        </button>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </form>
    </div>
  );
}
