import API from "../api/api";

const getAllCourses = () =>
  API.get("/api/courses");

const createCourse = (course) =>
  API.post("/api/courses", course);

const deleteCourse = (id) =>
  API.delete(`/api/courses/${id}`);

export default {
  getAllCourses,
  createCourse,
  deleteCourse,
};