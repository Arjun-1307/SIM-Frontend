import { useEffect, useState } from "react";
import MarksService from "../services/MarksService";
import StudentService from "../services/StudentService";
import CourseService from "../services/CourseService";

function Marks() {

  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    internalMarks: "",
    externalMarks: "",
    grade: ""
  });

  const loadMarks = async () => {
    const response =
      await MarksService.getAllMarks();

    setMarks(response.data);
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
    loadMarks();
    loadStudents();
    loadCourses();
  }, []);

  const saveMarks = async (e) => {

    e.preventDefault();

    const internal =
      Number(formData.internalMarks);

    const external =
      Number(formData.externalMarks);

    const payload = {

      student: {
        id: Number(formData.studentId)
      },

      course: {
        id: Number(formData.courseId)
      },

      internalMarks: internal,

      externalMarks: external,

      totalMarks:
        internal + external,

      grade:
        formData.grade
    };

    await MarksService
      .createMarks(payload);

    setFormData({
      studentId: "",
      courseId: "",
      internalMarks: "",
      externalMarks: "",
      grade: ""
    });

    loadMarks();
  };

  const deleteMarks =
    async (id) => {

      if (!window.confirm(
        "Delete Marks?"
      )) return;

      await MarksService
        .deleteMarks(id);

      loadMarks();
    };

  return (
    <div>

      <h2>Marks Management</h2>

      <div className="card p-4 mb-4">

        <form onSubmit={saveMarks}>

          <div className="row g-2">

            <div className="col-md-3">

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
                  Student
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

            <div className="col-md-3">

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
                  Course
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
                type="number"
                className="form-control"
                placeholder="Internal"
                value={
                  formData.internalMarks
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    internalMarks:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                type="number"
                className="form-control"
                placeholder="External"
                value={
                  formData.externalMarks
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    externalMarks:
                      e.target.value
                  })
                }
              />

            </div>

            <div className="col-md-2">

              <input
                className="form-control"
                placeholder="Grade"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    grade:
                      e.target.value
                  })
                }
              />

            </div>

          </div>

          <button
            className="btn btn-success mt-3"
          >
            Save Marks
          </button>

        </form>

      </div>

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>

            <th>ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>Internal</th>
            <th>External</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {marks.map((m) => (

            <tr key={m.id}>

              <td>{m.id}</td>

              <td>
                {m.student?.firstName}
              </td>

              <td>
                {m.course?.courseName}
              </td>

              <td>{m.internalMarks}</td>

              <td>{m.externalMarks}</td>

              <td>{m.totalMarks}</td>

              <td>{m.grade}</td>

              <td>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteMarks(m.id)
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

export default Marks;