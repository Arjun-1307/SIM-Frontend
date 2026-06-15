import { useEffect, useState } from "react";
import DepartmentService from "../services/DepartmentService";

function Department() {

  const [departments, setDepartments] =
    useState([]);

  const [department, setDepartment] =
    useState({
      departmentCode: "",
      departmentName: ""
    });

  const loadDepartments = async () => {

    const response =
      await DepartmentService
        .getAllDepartments();

    setDepartments(response.data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const saveDepartment = async (e) => {

    e.preventDefault();

    await DepartmentService
      .createDepartment(department);

    setDepartment({
      departmentCode: "",
      departmentName: ""
    });

    loadDepartments();
  };

  const deleteDepartment = async (id) => {

    if (!window.confirm(
      "Delete Department?"
    )) return;

    await DepartmentService
      .deleteDepartment(id);

    loadDepartments();
  };

  return (
    <div>

      <h2>Department Management</h2>

      <div className="card p-4 mb-4">

        <form onSubmit={saveDepartment}>

          <div className="row">

            <div className="col-md-4">

              <input
                className="form-control"
                placeholder="Department Code"
                value={
                  department.departmentCode
                }
                onChange={(e) =>
                  setDepartment({
                    ...department,
                    departmentCode:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-4">

              <input
                className="form-control"
                placeholder="Department Name"
                value={
                  department.departmentName
                }
                onChange={(e) =>
                  setDepartment({
                    ...department,
                    departmentName:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-4">

              <button
                className="btn btn-success w-100"
              >
                Add Department
              </button>

            </div>

          </div>

        </form>

      </div>

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {departments.map((d) => (

            <tr key={d.id}>

              <td>{d.id}</td>

              <td>
                {d.departmentCode}
              </td>

              <td>
                {d.departmentName}
              </td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteDepartment(d.id)
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

export default Department;