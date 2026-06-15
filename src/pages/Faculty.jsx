import { useEffect, useState } from "react";
import FacultyService from "../services/FacultyService";
import DepartmentService from "../services/DepartmentService";

function Faculty() {

  const [faculty, setFaculty] =
    useState([]);

  const [departments, setDepartments] =
    useState([]);

  const [facultyForm, setFacultyForm] =
    useState({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      designation: "",
      departmentId: ""
    });

  const loadFaculty = async () => {

    const response =
      await FacultyService.getAllFaculty();

    setFaculty(response.data);
  };

  const loadDepartments = async () => {

    const response =
      await DepartmentService
        .getAllDepartments();

    setDepartments(response.data);
  };

  useEffect(() => {
    loadFaculty();
    loadDepartments();
  }, []);

  const saveFaculty = async (e) => {

    e.preventDefault();

    const payload = {

      employeeId:
        facultyForm.employeeId,

      firstName:
        facultyForm.firstName,

      lastName:
        facultyForm.lastName,

      email:
        facultyForm.email,

      designation:
        facultyForm.designation,

      department: {
        id:
          Number(
            facultyForm.departmentId
          )
      }
    };

    await FacultyService
      .createFaculty(payload);

    setFacultyForm({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      designation: "",
      departmentId: ""
    });

    loadFaculty();
  };

  const deleteFaculty =
    async (id) => {

      if (!window.confirm(
        "Delete Faculty?"
      )) return;

      await FacultyService
        .deleteFaculty(id);

      loadFaculty();
    };

  return (
    <div>

      <h2 className="mb-4">
        Faculty Management
      </h2>

      <div className="card p-4 mb-4">

        <form onSubmit={saveFaculty}>

          <div className="row g-2">

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="Employee ID"
                value={
                  facultyForm.employeeId
                }
                onChange={(e) =>
                  setFacultyForm({
                    ...facultyForm,
                    employeeId:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="First Name"
                value={
                  facultyForm.firstName
                }
                onChange={(e) =>
                  setFacultyForm({
                    ...facultyForm,
                    firstName:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="Last Name"
                value={
                  facultyForm.lastName
                }
                onChange={(e) =>
                  setFacultyForm({
                    ...facultyForm,
                    lastName:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="Email"
                value={
                  facultyForm.email
                }
                onChange={(e) =>
                  setFacultyForm({
                    ...facultyForm,
                    email:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="Designation"
                value={
                  facultyForm.designation
                }
                onChange={(e) =>
                  setFacultyForm({
                    ...facultyForm,
                    designation:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <select
                className="form-control"
                value={
                  facultyForm.departmentId
                }
                onChange={(e) =>
                  setFacultyForm({
                    ...facultyForm,
                    departmentId:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Department
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

          </div>

          <div className="mt-3">

            <button
              className="btn btn-success"
            >
              Add Faculty
            </button>

          </div>

        </form>

      </div>

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>

            <th>ID</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {faculty.map((f) => (

            <tr key={f.id}>

              <td>{f.id}</td>

              <td>{f.employeeId}</td>

              <td>
                {f.firstName}
                {" "}
                {f.lastName}
              </td>

              <td>{f.email}</td>

              <td>{f.designation}</td>

              <td>
                {
                  f.department
                    ?.departmentName
                }
              </td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteFaculty(f.id)
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

export default Faculty;