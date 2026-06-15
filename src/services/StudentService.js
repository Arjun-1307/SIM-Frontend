import API from "../api/api";

const getAllStudents = () => {
  return API.get("/api/students");
};

const createStudent = (student) => {
  return API.post("/api/students", student);
};

const deleteStudent = (id) => {
  return API.delete(`/api/students/${id}`);
};

export default {
  getAllStudents,
  createStudent,
  deleteStudent,
};