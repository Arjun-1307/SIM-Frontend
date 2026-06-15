import API from "../api/api";

const getAllFaculty = () =>
  API.get("/api/faculty");

const createFaculty = (faculty) =>
  API.post("/api/faculty", faculty);

const deleteFaculty = (id) =>
  API.delete(`/api/faculty/${id}`);

export default {
  getAllFaculty,
  createFaculty,
  deleteFaculty,
};