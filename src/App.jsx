import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login           from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

import AdminDashboard   from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Dashboard        from "./pages/Dashboard";

import Students   from "./pages/Students";
import Faculty    from "./pages/Faculty";
import Courses    from "./pages/Courses";
import Department from "./pages/Department";
import Enrollment from "./pages/Enrollment";
import Marks      from "./pages/Marks";

// New pages
import AttendanceMgmt from "./pages/AttendanceMgmt";
import AISearch       from "./pages/AISearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="admin-dashboard"  element={<AdminDashboard />} />
          <Route path="faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="student-dashboard" element={<StudentDashboard />} />

          <Route path="students"    element={<Students />} />
          <Route path="faculty"     element={<Faculty />} />
          <Route path="courses"     element={<Courses />} />
          <Route path="departments" element={<Department />} />
          <Route path="enrollments" element={<Enrollment />} />
          <Route path="marks"       element={<Marks />} />

          {/* New routes */}
          <Route path="attendance-mgmt" element={<AttendanceMgmt />} />
          <Route path="ai-search"       element={<AISearch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;