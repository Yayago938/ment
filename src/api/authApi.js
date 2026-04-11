import api from "./axios";

export const signupStudent = (data) => api.post("/signup", data);
export const loginStudent = (data) => api.post("/login", data);