// Node.js backend (port 5001)
const NODE_API = "http://localhost:5001/api";

const AttendanceMgmtService = {
  getSummaries: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${NODE_API}/attendance/summary?${q}`).then((r) => r.json());
  },

  upsertSummary: (data) =>
    fetch(`${NODE_API}/attendance/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  bulkUpsert: (records) =>
    fetch(`${NODE_API}/attendance/summary/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    }).then((r) => r.json()),

  getAtRisk: () =>
    fetch(`${NODE_API}/attendance/at-risk`).then((r) => r.json()),

  getStats: () =>
    fetch(`${NODE_API}/attendance/stats`).then((r) => r.json()),

  deleteSummary: (id) =>
    fetch(`${NODE_API}/attendance/summary/${id}`, { method: "DELETE" }).then((r) => r.json()),
};

export default AttendanceMgmtService;
