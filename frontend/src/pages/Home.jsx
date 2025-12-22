import { useEffect, useState } from "react";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    api
      .get("/tasks", {
        headers: { Authorization: token }
      })
      .then((res) => {
        const tasks = res.data;
        setStats({
          total: tasks.length,
          completed: tasks.filter((t) => t.completed).length,
          pending: tasks.filter((t) => !t.completed).length
        });
      });
  }, []);

  return (
    <div className="home-bg">
      <div className="home-container fade-in">
        <h1>
          Welcome back, <span>{user?.name}</span> 👋
        </h1>
        <p className="subtitle">
          Stay productive and manage your tasks easily
        </p>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card slide-up">
            <h2>{stats.total}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card slide-up delay">
            <h2>{stats.completed}</h2>
            <p>Completed</p>
          </div>

          <div className="stat-card slide-up delay2">
            <h2>{stats.pending}</h2>
            <p>Pending</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions fade-in delay2">
          <a href="/tasks">View Tasks</a>
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
        </div>
      </div>
    </div>
  );
}
