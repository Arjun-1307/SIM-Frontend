import { useEffect, useState } from "react";
import CourseService from "../services/CourseService";
import DepartmentService from "../services/DepartmentService";

function Courses() {

  const [courses, setCourses] =
    useState([]);

  const [departments,
         setDepartments] =
    useState([]);

  const [course, setCourse] =
    useState({
      courseCode: "",
      courseName: "",
      credits: "",
      departmentId: ""
    });

  const loadCourses = async () => {

    const response =
      await CourseService.getAllCourses();

    setCourses(response.data);
  };

  const loadDepartments = async () => {

    const response =
      await DepartmentService
        .getAllDepartments();

    setDepartments(response.data);
  };

  useEffect(() => {

    loadCourses();
    loadDepartments();

  }, []);

  const saveCourse = async (e) => {

    e.preventDefault();

    const payload = {

      courseCode:
        course.courseCode,

      courseName:
        course.courseName,

      credits:
        Number(course.credits),

      department: {
        id:
          Number(
            course.departmentId
          )
      }
    };

    await CourseService
      .createCourse(payload);

    loadCourses();

    setCourse({
      courseCode: "",
      courseName: "",
      credits: "",
      departmentId: ""
    });
  };

  const deleteCourse =
    async (id) => {

      await CourseService
        .deleteCourse(id);

      loadCourses();
    };

  return (
    <div>

      <h2>Course Management</h2>

      <div className="card p-4 mb-4">

        <form onSubmit={saveCourse}>

          <div className="row">

            <div className="col-md-3">

              <input
                className="form-control"
                placeholder="Course Code"
                value={course.courseCode}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    courseCode:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-3">

              <input
                className="form-control"
                placeholder="Course Name"
                value={course.courseName}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    courseName:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                type="number"
                className="form-control"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    credits:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <select
                className="form-control"
                value={
                  course.departmentId
                }
                onChange={(e) =>
                  setCourse({
                    ...course,
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

            <div className="col-md-2">

              <button
                className="btn btn-success w-100"
              >
                Add Course
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
            <th>Credits</th>
            <th>Department</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {courses.map((c) => (

            <tr key={c.id}>

              <td>{c.id}</td>

              <td>{c.courseCode}</td>

              <td>{c.courseName}</td>

              <td>{c.credits}</td>

              <td>
                {
                  c.department
                    ?.departmentName
                }
              </td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteCourse(c.id)
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

export default Courses;