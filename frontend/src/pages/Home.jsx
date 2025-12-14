
import "./Home.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUserName(userObj.name);
    }
  }, []);

  return (
    <>
      

      <div className="home-container">
        <div className="welcome-box">
          <h1>Welcome {userName ? userName : "User"} 👋</h1>
          <p>Your account is successfully logged in.</p>
        </div>

        <div className="card-grid">
          <div className="card">
            <h3>Profile</h3>
            <p>View and manage your account details.</p>
          </div>

          <div className="card">
            <h3>Tasks</h3>
            <p>Organize your daily activities easily.</p>
          </div>

          <div className="card">
            <h3>Settings</h3>
            <p>Customize your app experience.</p>
          </div>
        </div>
      </div>
    </>
  );
}
