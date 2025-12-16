import { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Load profile
  useEffect(() => {
    api
      .get("/auth/me", {
        headers: { Authorization: token }
      })
      .then((res) => {
        setUser(res.data);
        setOriginalUser(res.data); // backup
      })
      .catch(() => setMessage("Failed to load user details"));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/update", user, {
        headers: { Authorization: token }
      });

      setUser(res.data);
      setOriginalUser(res.data);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch {
      setMessage("Update failed");
    }
  };

  const cancelEdit = () => {
    setUser(originalUser); // restore old data
    setEditMode(false);
  };

  const uploadImage = async (e) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", e.target.files[0]);

  const res = await api.post("/auth/upload-profile", formData, {
    headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data"
    }
  });

  setUser({ ...user, profileImage: res.data.profileImage });
};


  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* PROFILE IMAGE */}
        <div className="profile-img">
  <label htmlFor="profileUpload">
    <img
      src={
        user.profileImage
          ? `http://localhost:5000${user.profileImage}`
          : "/default-avatar.png"
      }
      alt="profile"
      title="Click to upload image"
    />
    <span className="upload-text">Change Photo</span>
  </label>

  <input
    id="profileUpload"
    type="file"
    accept="image/*"
    onChange={uploadImage}
    hidden
  />
</div>


        {!editMode ? (
          <>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p><strong>Phone:</strong> {user.phone || "Not added"}</p>
            <p><strong>Bio:</strong> {user.bio || "No bio added"}</p>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={saveChanges}>
            <input
              name="name"
              value={user.name || ""}
              onChange={handleChange}
            />
            <input
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              value={user.bio || ""}
              onChange={handleChange}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={cancelEdit}>Cancel</button>
          </form>
        )}

        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  
  );
  
}
