import { useEffect, useState, useRef } from "react";
import SearchService from "../services/SearchService";
import PerformanceService from "../services/PerformanceService";
import MarksService from "../services/MarksService";
import StudentService from "../services/StudentService";
import CourseService from "../services/CourseService";

function AISearch() {
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [syncing,     setSyncing]     = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [embCount,    setEmbCount]    = useState(null);
  const [msg,         setMsg]         = useState("");
  const [activeTab,   setActiveTab]   = useState("search"); // "search" | "top" | "weak"
  const [topList,     setTopList]     = useState([]);
  const [weakList,    setWeakList]    = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    SearchService.getSuggestions().then((r) => setSuggestions(r.suggestions || []));
    SearchService.embeddingCount().then((r) => setEmbCount(r.count ?? 0));
  }, []);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setQuery(q);
    setSearching(true);
    setResults([]);
    setMsg("");
    try {
      const res = await SearchService.semanticSearch(q, 15);
      if (!res.success) { setMsg("❌ " + (res.detail || "Search failed")); return; }
      if (res.results.length === 0) {
        setMsg("ℹ️ No results found. Try syncing embeddings first, or refine your query.");
      }
      setResults(res.results);
    } catch {
      setMsg("❌ FastAPI service (port 5002) not reachable. Start with: uvicorn main:app --port 5002");
    } finally {
      setSearching(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMsg("");
    try {
      // Fetch all marks from Spring Boot
      const [marksRes, studRes, courseRes] = await Promise.all([
        MarksService.getAllMarks(),
        StudentService.getAllStudents(),
        CourseService.getAllCourses(),
      ]);

      const marks   = marksRes.data   || [];
      const students = studRes.data  || [];
      const courses  = courseRes.data || [];

      if (marks.length === 0) {
        setMsg("⚠️ No marks data found in PostgreSQL. Add marks first.");
        return;
      }

      const records = marks.map((m) => {
        const student = students.find((s) => s.id === m.student?.id) || m.student || {};
        const course  = courses.find((c)  => c.id === m.course?.id)  || m.course  || {};
        return {
          studentId:     student.id     || m.student?.id,
          studentName:   `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          rollNumber:    student.rollNumber || "",
          department:    student.department?.departmentName || "",
          courseId:      course.id      || m.course?.id,
          courseName:    course.courseName  || m.course?.courseName  || "",
          internalMarks: m.internalMarks,
          externalMarks: m.externalMarks,
          totalMarks:    m.totalMarks,
          grade:         m.grade,
          semester:      m.semester || "N/A",
          academicYear:  m.academicYear || "2024-25",
        };
      });

      const res = await SearchService.syncEmbeddings(records);
      setMsg(`✅ Synced ${res.inserted || 0} embeddings from ${marks.length} mark records!`);
      const count = await SearchService.embeddingCount();
      setEmbCount(count.count ?? 0);
    } catch (e) {
      setMsg("❌ Sync failed: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const loadTop = async () => {
    setActiveTab("top");
    try {
      const res = await SearchService.topPerformers("", 10);
      setTopList(res.results || []);
    } catch { setMsg("❌ FastAPI service not reachable."); }
  };

  const loadWeak = async () => {
    setActiveTab("weak");
    try {
      const res = await PerformanceService.getWeakStudents(50);
      setWeakList(res.data || []);
    } catch { setMsg("❌ Node.js service not reachable."); }
  };

  const gradeColor = (g) => {
    if (!g) return "badge-purple";
    const upper = g.toUpperCase();
    if (upper === "A" || upper === "O") return "badge-green";
    if (upper === "B") return "badge-blue";
    if (upper === "C") return "badge-amber";
    return "badge-red";
  };

  return (
    <div>
      {/* Hero */}
      <div className="search-hero">
        <h2>🔍 AI Semantic Search</h2>
        <p>Ask natural language questions about student academic performance</p>
      </div>

      {/* Status Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <span className={`badge ${embCount > 0 ? "badge-green" : "badge-amber"}`}>
          🧠 {embCount !== null ? `${embCount} embeddings indexed` : "Checking…"}
        </span>
        <button className="btn btn-outline btn-sm" onClick={handleSync} disabled={syncing}>
          {syncing ? <><span className="spinner" /> Syncing…</> : "🔄 Sync from PostgreSQL"}
        </button>
      </div>

      {/* Search Box */}
      <div className="search-box-wrapper">
        <input
          ref={inputRef}
          className="search-box"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder='Try: "students weak in mathematics" or "top performers in semester"'
        />
        <button className="search-btn-icon" onClick={() => handleSearch()}>🔍</button>
      </div>

      {/* Suggestion Chips */}
      <div className="suggestion-chips">
        {suggestions.map((s) => (
          <span key={s} className="chip" onClick={() => handleSearch(s)}>{s}</span>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
        <button className={`btn btn-sm ${activeTab === "search" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("search")}>🔍 Semantic Results</button>
        <button className={`btn btn-sm ${activeTab === "top" ? "btn-primary" : "btn-outline"}`}
          onClick={loadTop}>🏆 Top Performers</button>
        <button className={`btn btn-sm ${activeTab === "weak" ? "btn-primary" : "btn-outline"}`}
          onClick={loadWeak}>⚠️ Weak Students</button>
      </div>

      {/* Message */}
      {msg && (
        <div className={`alert ${msg.startsWith("✅") ? "alert-success" : msg.startsWith("ℹ️") ? "alert-info" : msg.startsWith("⚠️") ? "alert-warning" : "alert-error"}`}
          style={{ maxWidth: 700, margin: "0 auto 18px" }}>
          {msg}
        </div>
      )}

      {/* ── Semantic Search Results ── */}
      {activeTab === "search" && (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {searching && (
            <div style={{ textAlign: "center", padding: 32 }}>
              <span className="spinner" />
              <p style={{ marginTop: 10, color: "var(--text-muted)" }}>Searching with AI…</p>
            </div>
          )}
          {!searching && results.length === 0 && !msg && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
              <p>Enter a natural language query above to search student data</p>
              <p style={{ fontSize: 12, marginTop: 6 }}>Powered by sentence-transformers (FastAPI) + MongoDB vector store</p>
            </div>
          )}
          {results.map((r, i) => (
            <div className="search-result-card" key={i}>
              <div className="search-rank">{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                    {r.studentName || "Unknown Student"}
                  </span>
                  {r.rollNumber && <span className="badge badge-purple" style={{ fontSize: 10 }}>{r.rollNumber}</span>}
                  {r.department  && <span className="badge badge-blue"   style={{ fontSize: 10 }}>{r.department}</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                  {r.courseName && <><strong>Course:</strong> {r.courseName} &nbsp;·&nbsp;</>}
                  {r.totalMarks != null && <><strong>Total:</strong> {r.totalMarks} &nbsp;·&nbsp;</>}
                  {r.internalMarks != null && <><strong>Internal:</strong> {r.internalMarks} &nbsp;·&nbsp;</>}
                  {r.externalMarks != null && <><strong>External:</strong> {r.externalMarks}</>}
                  {r.grade && <> &nbsp;·&nbsp;<span className={`badge ${gradeColor(r.grade)}`} style={{ fontSize: 10 }}>{r.grade}</span></>}
                </div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${Math.round(r.score * 100)}%` }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                  Relevance: {Math.round(r.score * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Top Performers ── */}
      {activeTab === "top" && (
        <div className="card" style={{ maxWidth: 800, margin: "0 auto", padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Dept</th>
                  <th>Avg Marks</th>
                  <th>Courses</th>
                </tr>
              </thead>
              <tbody>
                {topList.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 28, color: "var(--text-muted)" }}>
                    No data. Sync embeddings first.
                  </td></tr>
                ) : topList.map((r, i) => (
                  <tr key={i}>
                    <td><span className="badge badge-purple">{i + 1}</span></td>
                    <td style={{ fontWeight: 600, color: "var(--text-heading)" }}>{r._id?.studentName}</td>
                    <td>{r._id?.rollNumber}</td>
                    <td>{r._id?.department}</td>
                    <td style={{ color: "var(--accent-green)", fontWeight: 700 }}>{r.avgMarks}</td>
                    <td>{r.courses?.length} courses</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Weak Students ── */}
      {activeTab === "weak" && (
        <div className="card" style={{ maxWidth: 800, margin: "0 auto", padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Course</th>
                  <th>Total Marks</th>
                  <th>Internal</th>
                  <th>External</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {weakList.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 28, color: "var(--text-muted)" }}>
                    No data. Sync performance logs first.
                  </td></tr>
                ) : weakList.map((r, i) => (
                  <tr key={i}>
                    <td style={{ color: "var(--text-heading)", fontWeight: 500 }}>{r.studentName}</td>
                    <td>{r.rollNumber}</td>
                    <td>{r.courseName}</td>
                    <td style={{ color: "var(--accent-red)", fontWeight: 700 }}>{r.totalMarks}</td>
                    <td>{r.internalMarks}</td>
                    <td>{r.externalMarks}</td>
                    <td><span className={`badge ${gradeColor(r.grade)}`}>{r.grade || "N/A"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{ textAlign: "center", marginTop: 28, fontSize: 12, color: "var(--text-muted)" }}>
        🤖 Powered by sentence-transformers · FastAPI (port 5002) · MongoDB vector store
      </p>
    </div>
  );
}

export default AISearch;
