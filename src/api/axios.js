import axios from "axios";

const api = axios.create({
  baseURL: "https://mentorlink-backend-nhah.onrender.com",
});

const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
