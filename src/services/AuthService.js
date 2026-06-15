import API from "../api/api";

const login = (credentials) => {
  return API.post(
    "/api/auth/login",
    credentials
  );
};

export default {
  login,
};