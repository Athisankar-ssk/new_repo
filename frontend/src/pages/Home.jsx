import { useEffect, useState } from "react";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/tasks", { headers: { Authorization: token } })
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
    <div className="home-container">
      {/* HEADER */}
      <h1>Welcome, {user?.name} 👋</h1>
      <p className="subtitle">
        Manage your daily tasks efficiently
      </p>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{stats.total}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card completed">
          <h2>{stats.completed}</h2>
          <p>Completed</p>
        </div>

        <div className="stat-card pending">
          <h2>{stats.pending}</h2>
          <p>Pending</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <button>Create Task</button>
        <button>View Tasks</button>
        <button>Profile</button>
      </div>
    </div>
  );
}
