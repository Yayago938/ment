import axios from "axios";

const api = axios.create({
  baseURL: "https://mentorlink-backend-nhah.onrender.com",
});

// Reusable token getter
const getStoredToken = () => {
  // direct token keys
  const directToken =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("studentToken") ||
    sessionStorage.getItem("studentToken");

  if (directToken) return directToken;

  // token inside user-like objects
  const possibleObjects = [
    localStorage.getItem("user"),
    sessionStorage.getItem("user"),
    localStorage.getItem("student"),
    sessionStorage.getItem("student"),
    localStorage.getItem("auth"),
    sessionStorage.getItem("auth"),
  ];

  for (const item of possibleObjects) {
    if (!item) continue;

    try {
      const parsed = JSON.parse(item);
      const token =
        parsed?.token ||
        parsed?.accessToken ||
        parsed?.jwt ||
        parsed?.data?.token ||
        parsed?.data?.accessToken ||
        parsed?.user?.token;

      if (token) return token;
    } catch {
      // ignore invalid JSON
    }
  }

  return null;
};

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