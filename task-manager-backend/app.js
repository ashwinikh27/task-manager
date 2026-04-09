const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// In-memory task storage
let tasks = [];

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// GET all tasks
app.get("/tasks", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
});

// CREATE new task
app.post("/tasks", (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const newTask = {
      id: randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task"
    });
  }
});

// UPDATE task status (toggle completed)
app.patch("/tasks/:id", (req, res) => {
  try {
    const { id } = req.params;

    const task = tasks.find((t) => t.id === id);

    // If task not found
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Toggle completed status
    task.completed = !task.completed;

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
});

// DELETE a task
app.delete("/tasks/:id", (req, res) => {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === id);

    // If task not found
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Remove task
    const deletedTask = tasks.splice(taskIndex, 1);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
});

// Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});