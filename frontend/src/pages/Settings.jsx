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
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setForm(p => ({ ...p, notifications: res.data.notifications }));
    });
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const save = async () => {
    try {
      if (form.password) {
        if (form.password !== form.confirmPassword) {
          setMessage("Passwords do not match");
          return;
        }
        await api.put(
          "/auth/change-password",
          { oldPassword: form.oldPassword, newPassword: form.password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await api.put(
        "/auth/preferences",
        { notifications: form.notifications },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Settings saved!");
    } catch {
      setMessage("Update failed");
    }
  };

  const toggleTheme = () => {
    const t = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", t);
    document.body.className = t;
  };

  const del = async () => {
    if (!window.confirm("This cannot be undone. Continue?")) return;
    await api.delete("/auth/delete-account", {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.clear();
    window.location.href = "/register";
  };

  return (
    <div className="page-container">
      <div className="glass-card fade-in">
        <h1 className="page-title">Settings</h1>
        <p className="subtitle">Manage your account & preferences</p>

        {message && <p className="msg">{message}</p>}

        <div className="settings-grid">
          {/* Security */}
          <div className="settings-card">
            <h3>🔐 Security</h3>
            <input name="oldPassword" type="password" placeholder="Old password" onChange={onChange}/>
            <input name="password" type="password" placeholder="New password" onChange={onChange}/>
            <input name="confirmPassword" type="password" placeholder="Confirm password" onChange={onChange}/>
          </div>

          {/* Preferences */}
          <div className="settings-card">
            <h3>⚙ Preferences</h3>
            <label className="toggle">
              <span>Enable notifications</span>
              <input type="checkbox" name="notifications" checked={form.notifications} onChange={onChange}/>
            </label>
            <label className="toggle">
              <span>Dark mode</span>
              <input type="checkbox" checked={darkMode} onChange={toggleTheme}/>
            </label>
          </div>

          {/* Danger */}
          <div className="settings-card danger">
            <h3>⚠ Danger zone</h3>
            <button className="btn-danger" onClick={del}>Delete account</button>
          </div>
        </div>

        <button className="btn-primary save-btn" onClick={save}>Save changes</button>
      </div>
    </div>
  );
}
