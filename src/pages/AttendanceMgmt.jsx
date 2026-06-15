import { useEffect, useState } from "react";
import StudentService   from "../services/StudentService";
import CourseService    from "../services/CourseService";
import AttendanceMgmtService from "../services/AttendanceMgmtService";

function AttendanceMgmt() {
  const [summaries, setSummaries] = useState([]);
  const [students,  setStudents]  = useState([]);
  const [courses,   setCourses]   = useState([]);
  const [stats,     setStats]     = useState(null);
  const [filter,    setFilter]    = useState("ALL");
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState("");

  const [form, setForm] = useState({
    studentId:    "",
    courseId:     "",
    totalClasses: "",
    attended:     "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== "ALL" ? { status: filter } : {};
      const [s, st, c, stats] = await Promise.all([
        AttendanceMgmtService.getSummaries(params),
        StudentService.getAllStudents(),
        CourseService.getAllCourses(),
        AttendanceMgmtService.getStats(),
      ]);
      setSummaries(s.data  || []);
      setStudents(st.data  || []);
      setCourses(c.data    || []);
      setStats(stats.data  || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId || !form.totalClasses || !form.attended) {
      setMsg("⚠️ All fields are required.");
      return;
    }

    const student = students.find((s) => s.id === Number(form.studentId));
    const course  = courses.find((c)  => c.id === Number(form.courseId));

    setSaving(true);
    setMsg("");
    try {
      await AttendanceMgmtService.upsertSummary({
        studentId:    Number(form.studentId),
        courseId:     Number(form.courseId),
        totalClasses: Number(form.totalClasses),
        attended:     Number(form.attended),
        studentName:  student ? `${student.firstName} ${student.lastName}` : "",
        rollNumber:   student?.rollNumber || "",
        courseName:   course?.courseName  || "",
      });
      setMsg("✅ Attendance saved successfully!");
      setForm({ studentId: "", courseId: "", totalClasses: "", attended: "" });
      load();
    } catch (e) {
      setMsg("❌ Failed to save. Check Node.js service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this attendance record?")) return;
    await AttendanceMgmtService.deleteSummary(id);
    load();
  };

  const pctColor = (pct) => {
    if (pct >= 75) return "#10b981";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div>
      <div className="page-header">
        <h2>📅 Attendance Management</h2>
        <p>Track and manage student attendance via MongoDB (Node.js service)</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📊</div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Records</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div>
              <div className="stat-value">{stats.good}</div>
              <div className="stat-label">Good (≥75%)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">⚠️</div>
            <div>
              <div className="stat-value">{stats.warning}</div>
              <div className="stat-label">Warning (60–74%)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">🚨</div>
            <div>
              <div className="stat-value">{stats.detained}</div>
              <div className="stat-label">Detained (&lt;60%)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">📈</div>
            <div>
              <div className="stat-value">{stats.averagePercentage}%</div>
              <div className="stat-label">Avg Attendance</div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Update Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Add / Update Attendance Record</h3>
        {msg && (
          <div className={`alert ${msg.startsWith("✅") ? "alert-success" : msg.startsWith("❌") ? "alert-error" : "alert-warning"}`} style={{ marginBottom: 12 }}>
            {msg}
          </div>
        )}
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>Student</label>
              <select className="form-control" value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.rollNumber} – {s.firstName} {s.lastName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Course</label>
              <select className="form-control" value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.courseCode} – {c.courseName}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ maxWidth: 140 }}>
              <label>Total Classes</label>
              <input type="number" className="form-control" placeholder="e.g. 60"
                value={form.totalClasses}
                onChange={(e) => setForm({ ...form, totalClasses: e.target.value })} />
            </div>
            <div className="form-group" style={{ maxWidth: 140 }}>
              <label>Classes Attended</label>
              <input type="number" className="form-control" placeholder="e.g. 50"
                value={form.attended}
                onChange={(e) => setForm({ ...form, attended: e.target.value })} />
            </div>
            <div className="form-group" style={{ maxWidth: 130, justifyContent: "flex-end" }}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? <span className="spinner" /> : "💾 Save"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["ALL", "GOOD", "WARNING", "DETAINED"].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : f === "GOOD" ? "✅ Good" : f === "WARNING" ? "⚠️ Warning" : "🚨 Detained"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          {loading ? (
            <div style={{ padding: 32, textAlign: "center" }}>
              <span className="spinner" /> Loading…
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Course</th>
                  <th>Total</th>
                  <th>Attended</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {summaries.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                    No records found. Add attendance above or check Node.js service (port 5001).
                  </td></tr>
                ) : summaries.map((s) => (
                  <tr key={s._id}>
                    <td style={{ color: "var(--text-heading)", fontWeight: 500 }}>{s.studentName}</td>
                    <td><span className="badge badge-purple">{s.rollNumber}</span></td>
                    <td>{s.courseName}</td>
                    <td>{s.totalClasses}</td>
                    <td>{s.attended}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: pctColor(s.percentage), fontWeight: 700, minWidth: 38 }}>
                          {s.percentage}%
                        </span>
                        <div className="attendance-bar-bg" style={{ flex: 1 }}>
                          <div className="attendance-bar-fill"
                            style={{ width: `${s.percentage}%`, background: pctColor(s.percentage) }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${s.status === "GOOD" ? "badge-green" : s.status === "WARNING" ? "badge-amber" : "badge-red"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceMgmt;
