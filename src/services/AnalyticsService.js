// Node.js backend (port 5001)
const NODE_API = "http://localhost:5001/api";

const AnalyticsService = {
  getSummary: () =>
    fetch(`${NODE_API}/analytics/summary`).then((r) => r.json()),

  getDepartmentStats: () =>
    fetch(`${NODE_API}/analytics/department-stats`).then((r) => r.json()),

  getCourseStats: () =>
    fetch(`${NODE_API}/analytics/course-stats`).then((r) => r.json()),
};

export default AnalyticsService;
