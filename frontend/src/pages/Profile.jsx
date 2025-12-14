import { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/auth/me", {
        headers: { Authorization: token }
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => setMessage("Failed to load user details try again"));
  }, []);

  
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  
  const saveChanges = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await api.put("/auth/update", user, {
        headers: { Authorization: token }
      });

      setUser(res.data);
      setMessage("Profile updated!");
      setEditMode(false);     // 🔥 go back to display mode  
    } catch (err) {
      setMessage("Update failed");
    }
  };

  
  const cancelEdit = () => {
    setEditMode(false);
    window.location.reload(); // reload original data
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {message && <p className="msg">{message}</p>}

      {/* 🔥 DISPLAY MODE */}
      {!editMode && (
        <div className="profile-display">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "Not added"}</p>
          <p><strong>Bio:</strong> {user.bio || "No bio added"}</p>

          <button className="edit-btn" onClick={() => setEditMode(true)}>
            Edit
          </button>
        </div>
      )}

      {/* 🔥 EDIT MODE */}
      {editMode && (
        <form className="profile-card" onSubmit={saveChanges}>
          <label>Name</label>
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
          />

          <label>Phone</label>
          <input
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={user.bio || ""}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="save-btn">Save</button>

          <button type="button" className="cancel-btn"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
