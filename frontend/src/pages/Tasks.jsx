import { useEffect, useState } from "react";
import api from "../services/api";
import "./Tasks.css";

export default function Tasks() {
  const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: ""
  });

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await api.get("/tasks", {
      headers: { Authorization: token }
    });
    setTasks(res.data);
  };

  // CREATE
  const createTask = async (e) => {
    e.preventDefault();
    await api.post("/tasks", task, {
      headers: { Authorization: token }
    });
    setTask({ title: "", description: "", priority: "Medium", dueDate: "" });
    fetchTasks();
  };

  // COMPLETE
  const toggleComplete = async (t) => {
    await api.put(
      `/tasks/${t._id}`,
      { completed: !t.completed },
      { headers: { Authorization: token } }
    );
    fetchTasks();
  };

  // EDIT
  const startEdit = (t) => {
    setEditId(t._id);
    setEditTask(t);
  };

  // UPDATE
  const updateTask = async () => {
    await api.put(`/tasks/${editId}`, editTask, {
      headers: { Authorization: token }
    });
    setEditId(null);
    fetchTasks();
  };

  // DELETE
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`, {
      headers: { Authorization: token }
    });
    fetchTasks();
  };

  return (
    <div className="tasks-container">
      {/* CREATE TASK */}
      <div className="task-card">
        <h2>Create Task</h2>
        <form onSubmit={createTask}>
          <input
            placeholder="Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          />
          <button>Add Task</button>
        </form>
      </div>

      {/* TASK LIST */}
      <div className="task-list">
        {tasks.map((t) => (
          <div key={t._id} className={`task-item ${t.completed ? "done" : ""}`}>
            {editId === t._id ? (
              /* EDIT MODE */
              <div className="edit-box">
                <input
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                />
                <textarea
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                />
                <select
                  value={editTask.priority}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                />
                <button onClick={updateTask}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              /* VIEW MODE */
              <>
                <div>
                  <h4>{t.title}</h4>
                  <span className={`badge ${t.priority}`}>{t.priority}</span>
                  <p>{t.description}</p>
                  <small>Due: {t.dueDate || "No date"}</small>
                </div>

                <div className="actions">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t)}
                  />
                  <button onClick={() => startEdit(t)}>✏️</button>
                  <button onClick={() => deleteTask(t._id)}>❌</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
