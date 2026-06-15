import { useEffect, useState } from "react";
import EnrollmentService from "../services/EnrollmentService";
import StudentService from "../services/StudentService";
import CourseService from "../services/CourseService";

function Enrollment() {

  const [enrollments, setEnrollments] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [formData, setFormData] =
    useState({
      studentId: "",
      courseId: "",
      enrollmentDate: ""
    });

  const loadEnrollments = async () => {
    const response =
      await EnrollmentService.getAllEnrollments();

    setEnrollments(response.data);
  };

  const loadStudents = async () => {
    const response =
      await StudentService.getAllStudents();

    setStudents(response.data);
  };

  const loadCourses = async () => {
    const response =
      await CourseService.getAllCourses();

    setCourses(response.data);
  };

  useEffect(() => {
    loadEnrollments();
    loadStudents();
    loadCourses();
  }, []);

  const saveEnrollment = async (e) => {

    e.preventDefault();

    const payload = {

      student: {
        id:
          Number(formData.studentId)
      },

      course: {
        id:
          Number(formData.courseId)
      },

      enrollmentDate:
        formData.enrollmentDate
    };

    await EnrollmentService
      .createEnrollment(payload);

    setFormData({
      studentId: "",
      courseId: "",
      enrollmentDate: ""
    });

    loadEnrollments();
  };

  const deleteEnrollment =
    async (id) => {

      if (!window.confirm(
        "Delete Enrollment?"
      )) return;

      await EnrollmentService
        .deleteEnrollment(id);

      loadEnrollments();
    };

  return (
    <div>

      <h2>Enrollment Management</h2>

      <div className="card p-4 mb-4">

        <form onSubmit={saveEnrollment}>

          <div className="row">

            <div className="col-md-4">

              <select
                className="form-control"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    studentId:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Student
                </option>

                {students.map((s) => (

                  <option
                    key={s.id}
                    value={s.id}
                  >
                    {s.rollNumber}
                    {" - "}
                    {s.firstName}
                  </option>

                ))}

              </select>

            </div>

            <div className="col-md-4">

              <select
                className="form-control"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseId:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Course
                </option>

                {courses.map((c) => (

                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.courseCode}
                    {" - "}
                    {c.courseName}
                  </option>

                ))}

              </select>

            </div>

            <div className="col-md-2">

              <input
                type="date"
                className="form-control"
                value={
                  formData.enrollmentDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enrollmentDate:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <button
                className="btn btn-success w-100"
              >
                Enroll
              </button>

            </div>

          </div>

        </form>

      </div>

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>

            <th>ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>Date</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {enrollments.map((e) => (

            <tr key={e.id}>

              <td>{e.id}</td>

              <td>
                {e.student?.firstName}
                {" "}
                {e.student?.lastName}
              </td>

              <td>
                {e.course?.courseName}
              </td>

              <td>
                {e.enrollmentDate}
              </td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteEnrollment(e.id)
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

export default Enrollment;