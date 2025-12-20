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

  // Load notification preference
  useEffect(() => {
    api
      .get("/auth/me", { headers: { Authorization: token } })
      .then((res) => {
        setForm((prev) => ({
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

  // 🔐 CHANGE PASSWORD
  const updatePassword = async () => {
    if (!form.oldPassword || !form.password) return;
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    await api.put(
      "/auth/change-password",
      {
        oldPassword: form.oldPassword,
        newPassword: form.password
      },
      { headers: { Authorization: token } }
    );
  };

  // 🔔 SAVE NOTIFICATIONS
  const saveNotifications = async () => {
    await api.put(
      "/auth/preferences",
      { notifications: form.notifications },
      { headers: { Authorization: token } }
    );
  };

  // 🌙 THEME TOGGLE
  const toggleTheme = () => {
    const theme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  };

  // 🗑️ DELETE ACCOUNT
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    await api.delete("/auth/delete-account", {
      headers: { Authorization: token }
    });

    localStorage.clear();
    window.location.href = "/register";
  };

  // 💾 SAVE ALL
  const updateSettings = async (e) => {
    e.preventDefault();

    try {
      await updatePassword();
      await saveNotifications();
      setMessage("Settings updated successfully!");
    } catch {
      setMessage("Failed to update settings");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Settings</h2>

        {message && <p className="msg">{message}</p>}

        <form onSubmit={updateSettings}>
          {/* CHANGE PASSWORD */}
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            onChange={handleChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
          />

         {/* NOTIFICATIONS */}
<label className="toggle">
  <span>Enable Notifications</span>
  <input
    type="checkbox"
    name="notifications"
    checked={form.notifications}
    onChange={handleChange}
  />
</label>


          {/* THEME */}
          <div className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span>Dark Mode</span>
          </div>

          <button type="submit">Save Settings</button>
        </form>

        <hr />

        {/* DELETE ACCOUNT */}
        <button className="danger-btn" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
