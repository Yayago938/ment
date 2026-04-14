import api from "./axios";

export const signupStudent = (data) => api.post("/signup", data);

export const loginStudent = (data) => api.post("/login", data);

export const getOneStudent = async (studentId) => {
  const res = await api.get(`/student-profile/${studentId}`);
  return res.data; 
};

export const loginCommittee = async (data) => {
  const res = await api.post("/committee-login", data);
  return res.data;
};