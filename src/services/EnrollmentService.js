import API from "../api/api";

const getAllEnrollments = () =>
  API.get("/api/enrollments");

const createEnrollment = (enrollment) =>
  API.post("/api/enrollments", enrollment);

const deleteEnrollment = (id) =>
  API.delete(`/api/enrollments/${id}`);

export default {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
};