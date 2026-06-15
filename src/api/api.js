import axios from "axios";

const API = axios.create({
  baseURL: "https://sim-springboot.onrender.com/api/auth/login",
});

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default API;