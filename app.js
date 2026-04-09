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

// Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});