import { useEffect, useState } from "react";
import api from "../services/api";
import "./Settings.css";

export default function Settings() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
    notifications: true
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/auth/me", {
      headers: { Authorization: token }
    }).then((res) => {
      setForm(prev => ({
        ...prev,
        notifications: res.data.notifications
      }));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const saveSettings = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      if (form.password) {
        await api.put(
          "/auth/change-password",
          {
            oldPassword: form.oldPassword,
            newPassword: form.password
          },
          { headers: { Authorization: token } }
        );
      }

      await api.put(
        "/auth/preferences",
        { notifications: form.notifications },
        { headers: { Authorization: token } }
      );

      setMessage("Settings updated successfully!");
    } catch {
      setMessage("Update failed");
    }
  };

  const toggleTheme = () => {
    const theme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  };

  const deleteAccount = async () => {
    if (!window.confirm("This action cannot be undone. Continue?")) return;

    await api.delete("/auth/delete-account", {
      headers: { Authorization: token }
    });

    localStorage.clear();
    window.location.href = "/register";
  };

  return (
    <div className="page-container">
      <div className="settings-card fade-in">
        <h2>Settings</h2>

        {message && <p className="msg">{message}</p>}

        <form onSubmit={saveSettings}>
          {/* SECURITY */}
          <h4 className="section-title">Security</h4>

          <input
            type="password"
            name="oldPassword"
            placeholder="Old password"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="New password"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            onChange={handleChange}
          />

          {/* PREFERENCES */}
          <h4 className="section-title">Preferences</h4>

          <label className="toggle">
            <span>Enable notifications</span>
            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />
          </label>

          <label className="toggle">
            <span>Dark mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />
          </label>

          <button type="submit" className="btn-primary">
            Save Settings
          </button>
        </form>

        {/* DANGER ZONE */}
        <div className="danger-zone">
          <h4>Danger Zone</h4>
          <button
            type="button"
            className="btn-danger"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
