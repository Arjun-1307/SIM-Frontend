import { NavLink, useNavigate } from "react-router-dom";

const ADMIN_LINKS = [
  { to: "/admin-dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/students",        icon: "👨‍🎓", label: "Students" },
  { to: "/faculty",         icon: "👩‍🏫", label: "Faculty" },
  { to: "/courses",         icon: "📚", label: "Courses" },
  { to: "/departments",     icon: "🏛️", label: "Departments" },
  { to: "/enrollments",     icon: "📋", label: "Enrollments" },
  { to: "/marks",           icon: "📝", label: "Marks" },
  { to: "/attendance-mgmt", icon: "📅", label: "Attendance" },
  { to: "/ai-search",       icon: "🔍", label: "AI Search" },
];

const FACULTY_LINKS = [
  { to: "/faculty-dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/marks",             icon: "📝", label: "Marks" },
  { to: "/attendance-mgmt",   icon: "📅", label: "Attendance" },
  { to: "/ai-search",         icon: "🔍", label: "AI Search" },
];

const STUDENT_LINKS = [
  { to: "/student-dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/ai-search",         icon: "🔍", label: "AI Search" },
];

function Sidebar() {
  const navigate  = useNavigate();
  const role      = localStorage.getItem("role") || "STUDENT";
  const userStr   = localStorage.getItem("user");
  const user      = userStr ? JSON.parse(userStr) : {};
  const username  = user.username || role;

  const links =
    role === "ADMIN"   ? ADMIN_LINKS :
    role === "FACULTY" ? FACULTY_LINKS :
    STUDENT_LINKS;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">S</div>
        <div>
          <div className="sidebar-logo-text">SIM Portal</div>
          <div className="sidebar-logo-sub">Student Info System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <span className="icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">{username[0]?.toUpperCase()}</div>
        <div>
          <div className="sidebar-footer-name">{username}</div>
          <div className="sidebar-footer-role">{role}</div>
        </div>
        <button className="sidebar-footer-logout" onClick={handleLogout} title="Logout">
          🚪
        </button>
      </div>
    </div>
  );
}

export default Sidebar;