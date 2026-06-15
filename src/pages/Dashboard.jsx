import { useEffect, useState } from "react";
import API from "../api/api";

function Dashboard() {

  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    courses: 0,
    departments: 0,
  });

  const loadDashboard = async () => {
    const res =
      await API.get("/api/admin/dashboard");

    setStats(res.data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>

      <h2 className="mb-4">
        Admin Dashboard
      </h2>

      <div className="row">

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Students</h5>
            <h2>{stats.students}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Faculty</h5>
            <h2>{stats.faculty}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Courses</h5>
            <h2>{stats.courses}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Departments</h5>
            <h2>{stats.departments}</h2>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;