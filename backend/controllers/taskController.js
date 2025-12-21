import Task from "../models/Task.js";

// CREATE
export const createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user
  });
  res.json(task);
};

// GET USER TASKS
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
  res.json(tasks);
};

// UPDATE
export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
};

// DELETE
export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Task deleted" });
};
