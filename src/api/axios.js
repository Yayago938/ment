import axios from "axios";

const api = axios.create({
  baseURL: "https://mentorlink-backend-nhah.onrender.com",
});

// Reusable token getter
const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;