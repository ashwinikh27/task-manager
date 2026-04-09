import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const API_URL = "http://localhost:5000/tasks";

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data.data);
    } catch {
      setError("Failed to fetch tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(API_URL, { title });
      setTitle("");
      fetchTasks();
    } catch {
      setError("Failed to add task");
    }
  };

  // Toggle complete
  const toggleTask = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}`);
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task Manager</h1>

        {/* Input */}
        <div style={styles.inputSection}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addBtn}>
            Add
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
  {["all", "completed", "pending"].map((type) => (
    <button
      key={type}
      onClick={() => setFilter(type)}
      style={{
        ...styles.filterBtn,
        ...(filter === type ? styles.activeFilter : {}),
      }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  ))}
</div>

        {/* Stats */}
        <div style={styles.stats}>
          <span>Total: {tasks.length}</span>
          <span>
            Completed: {tasks.filter((t) => t.completed).length}
          </span>
        </div>

        {/* States */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Task List */}
        <ul style={styles.list}>
          {filteredTasks.map((task) => (
            <li key={task.id} style={styles.task}>
              <span
                onClick={() => toggleTask(task.id)}
                style={{
                  ...styles.taskText,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#888" : "#000",
                }}
              >
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "600",
  },

  inputSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
  },

  addBtn: {
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
  },

  // 🔥 FIXED FILTERS
  filters: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },

  filterBtn: {
    flex: 1,
    margin: "0 5px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#f5f5f5",
    cursor: "pointer",
  },

  activeFilter: {
    background: "#667eea",
    color: "white",
    border: "none",
  },

  stats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    fontSize: "13px",
    color: "#666",
  },

  list: {
    listStyle: "none",
    padding: 0,
  },

  task: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    background: "#f8f9fc",
    marginBottom: "10px",
    transition: "0.2s",
  },

  taskText: {
    cursor: "pointer",
    fontSize: "15px",
  },

  deleteBtn: {
    background: "#ff4d4f",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default App;