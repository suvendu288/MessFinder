import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("messfinder_user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
