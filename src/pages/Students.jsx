import { useEffect, useState } from "react";
import StudentService from "../services/StudentService";
import DepartmentService from "../services/DepartmentService";

function Students() {

  const [students, setStudents] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [formData, setFormData] =
    useState({
      rollNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      departmentId: ""
    });

  const loadStudents = async () => {
    const res =
      await StudentService.getAllStudents();

    setStudents(res.data);
  };

  const loadDepartments = async () => {
    const res =
      await DepartmentService.getAllDepartments();

    setDepartments(res.data);
  };

  useEffect(() => {
    loadStudents();
    loadDepartments();
  }, []);

  const saveStudent = async (e) => {

    e.preventDefault();

    await StudentService.createStudent(
      formData
    );

    setFormData({
      rollNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      departmentId: ""
    });

    loadStudents();
  };

  const deleteStudent = async (id) => {

    await StudentService.deleteStudent(id);

    loadStudents();
  };

  return (
    <div>

      <h2 className="mb-3">
        Student Management
      </h2>

      <div className="card p-3 mb-4">

        <form onSubmit={saveStudent}>

          <div className="row">

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rollNumber: e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
              />
            </div>

            <div className="col-md-2">
              <select
                className="form-control"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    departmentId:
                      e.target.value
                  })
                }
              >
                <option>
                  Select Department
                </option>

                {departments.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                  >
                    {d.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-success w-100"
              >
                Save
              </button>
            </div>

          </div>

        </form>

      </div>

      <table className="table table-bordered">

        <thead>

          <tr>
            <th>ID</th>
            <th>Roll No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {students.map((s) => (

            <tr key={s.id}>

              <td>{s.id}</td>
              <td>{s.rollNumber}</td>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.email}</td>

              <td>
                {s.department?.departmentName}
              </td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteStudent(s.id)
                  }
                >
                  Delete
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Students;