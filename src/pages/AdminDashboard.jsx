import { useEffect, useState } from "react";
import AnalyticsService from "../services/AnalyticsService";
import PerformanceService from "../services/PerformanceService";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    Promise.all([
      AnalyticsService.getSummary(),
      AnalyticsService.getDepartmentStats(),
    ])
      .then(([s, d]) => {
        setSummary(s.data || null);
        setDeptStats(d.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome back, {user.username || "Admin"} 👋</h2>
        <p>Here's your Student Information Management System overview</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <span className="spinner" />
          <p style={{ marginTop: 12, color: "var(--text-muted)" }}>
            Loading analytics from MongoDB…
          </p>
        </div>
      ) : (
        <>
          {/* Stats from MongoDB */}
          {summary ? (
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-icon blue">📊</div>
                <div>
                  <div className="stat-value">{summary.totalPerformanceLogs}</div>
                  <div className="stat-label">Performance Logs</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">👨‍🎓</div>
                <div>
                  <div className="stat-value">{summary.uniqueStudents}</div>
                  <div className="stat-label">Unique Students</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">📈</div>
                <div>
                  <div className="stat-value">{summary.averageTotalMarks}</div>
                  <div className="stat-label">Avg Total Marks</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon amber">⚠️</div>
                <div>
                  <div className="stat-value">{summary.attendanceAlerts?.warning || 0}</div>
                  <div className="stat-label">Attendance Warnings</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon red">🚨</div>
                <div>
                  <div className="stat-value">{summary.attendanceAlerts?.detained || 0}</div>
                  <div className="stat-label">Detained Students</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              ℹ️ Analytics not available — start the Node.js service (port 5001) and sync performance data.
            </div>
          )}

          {/* Grade Breakdown */}
          {summary?.gradeBreakdown && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>📊 Grade Distribution (MongoDB)</h3>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {Object.entries(summary.gradeBreakdown).map(([grade, count]) => (
                  <div key={grade} style={{ textAlign: "center", minWidth: 70 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-heading)" }}>{count}</div>
                    <div className={`badge badge-${grade === "A" ? "green" : grade === "B" ? "blue" : grade === "C" ? "amber" : "red"}`}>
                      Grade {grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Stats */}
          {deptStats.length > 0 && (
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <h3>🏛️ Department Performance (MongoDB Analytics)</h3>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Students</th>
                      <th>Records</th>
                      <th>Avg Marks</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptStats.map((d, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: "var(--text-heading)" }}>{d.department || "N/A"}</td>
                        <td>{d.studentCount}</td>
                        <td>{d.totalRecords}</td>
                        <td style={{ color: "var(--accent-green)", fontWeight: 700 }}>{d.avgMarks}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="attendance-bar-bg" style={{ width: 100 }}>
                              <div className="attendance-bar-fill"
                                style={{ width: `${Math.min(100, (d.avgMarks / 100) * 100)}%`, background: "var(--gradient)" }} />
                            </div>
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.avgMarks}/100</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {deptStats.length === 0 && !summary && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <h3>No MongoDB Data Yet</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
                Add marks in the Marks page, then use AI Search → Sync to populate analytics.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;