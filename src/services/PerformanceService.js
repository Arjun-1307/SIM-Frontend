import API from "../api/api";

// Node.js backend (port 5001)
const NODE_API = "http://localhost:5001/api";

const PerformanceService = {
  // Sync marks data from Spring → Node MongoDB
  syncLogs: (logs) =>
    fetch(`${NODE_API}/performance/logs/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    }).then((r) => r.json()),

  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${NODE_API}/performance/logs?${q}`).then((r) => r.json());
  },

  getGradeDistribution: () =>
    fetch(`${NODE_API}/performance/grade-distribution`).then((r) => r.json()),

  getTopPerformers: (limit = 10) =>
    fetch(`${NODE_API}/performance/top-performers?limit=${limit}`).then((r) => r.json()),

  getWeakStudents: (threshold = 50) =>
    fetch(`${NODE_API}/performance/weak-students?threshold=${threshold}`).then((r) => r.json()),
};

export default PerformanceService;
