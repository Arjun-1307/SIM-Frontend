import API from "../api/api";

const getAllDepartments = () =>
  API.get("/api/departments");

const createDepartment = (department) =>
  API.post("/api/departments", department);

const deleteDepartment = (id) =>
  API.delete(`/api/departments/${id}`);

export default {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
};