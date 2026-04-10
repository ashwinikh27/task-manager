import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trash2, ListTodo, Sparkles } from "lucide-react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/tasks";

 const fetchTasks = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await axios.get(API_URL);
    setTasks(res.data.data);
  } catch (err) {
    setError("Failed to fetch tasks");
  }

  setLoading(false);
};

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
  if (!title.trim()) return;

  try {
    await axios.post(API_URL, { title });
    setTitle("");
    fetchTasks();
  } catch (err) {
    setError("Failed to add task");
  }
};

const toggleTask = async (id) => {
  try {
    await axios.patch(`${API_URL}/${id}`);
    fetchTasks();
  } catch (err) {
    setError("Failed to update task");
  }
};

 const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  } catch (err) {
    setError("Failed to delete task");
  }
};

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-black text-white flex">

      {/* SIDEBAR */}
      <div className="hidden md:flex flex-col w-60 border-r border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6">

        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="text-indigo-400 animate-pulse" size={18} />
          <h1 className="text-lg font-semibold tracking-wide">
            Task Manager
          </h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs text-slate-400">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>

          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 shadow-md hover:scale-[1.02] transition">
            <p className="text-xs text-green-400">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completed}</p>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 shadow-md hover:scale-[1.02] transition">
            <p className="text-xs text-orange-400">Pending</p>
            <p className="text-2xl font-bold text-orange-400">{pending}</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Your Tasks
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Keep track of your tasks and stay productive! 
          </p>
        </div>

        {/* INPUT */}
        <div className="mb-8">
<div className="flex items-center bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 shadow-sm transition-all duration-300 hover:border-indigo-400/40 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
className="flex-1 bg-transparent px-3 py-1 outline-none text-sm placeholder:text-slate-500 transition-all duration-200"            />

            <button
              onClick={addTask}
              className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-indigo-500/50 transition active:scale-95"
            >
              Add
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6">
         {["all", "completed", "pending"].map((f) => (
  <button
    key={f}
    onClick={() => setFilter(f)}
    className={`text-sm px-4 py-2 rounded-md transition font-medium border ${
      filter === f
        ? "bg-indigo-600 border-indigo-500 text-white shadow-sm scale-105"
        : "bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700"
    }`}
  >
    {f.charAt(0).toUpperCase() + f.slice(1)}
  </button>
))}
        </div>

        {/* TASK LIST */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-xl backdrop-blur-xl">

        {loading && (
    <p className="text-center text-slate-400 py-4">Loading...</p>
    )}

   {error && (
     <p className="text-center text-red-400 py-2">{error}</p>
   )}

          {filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <ListTodo className="mx-auto mb-3 text-slate-500" size={34} />
                <p className="text-slate-300">No tasks yet</p>
                <p className="text-sm text-slate-500">
                  Add your first task above 
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.03 }}
                    className="group flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:shadow-xl transition"
                  >
                    <motion.div
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3 cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{
                          scale: task.completed ? 1.2 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle2
                          size={18}
                          className={
                            task.completed
                              ? "text-green-400"
                              : "text-slate-500"
                          }
                        />
                      </motion.div>

                      <motion.span
                        animate={{
                          opacity: task.completed ? 0.6 : 1,
                        }}
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-slate-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </motion.span>
                    </motion.div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;