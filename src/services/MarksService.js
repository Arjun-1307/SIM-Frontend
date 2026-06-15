import API from "../api/api";

const getAllMarks = () =>
  API.get("/api/marks");

const createMarks = (marks) =>
  API.post("/api/marks", marks);

const deleteMarks = (id) =>
  API.delete(`/api/marks/${id}`);

export default {
  getAllMarks,
  createMarks,
  deleteMarks,
};