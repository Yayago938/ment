import api from "./axios";

export const signupStudent = (data) => api.post("/signup", data);

export const loginStudent = (data) => api.post("/login", data);

export const normalizeStudentResponse = (response) => {
  if (!response) return null;

  return (
    response?.data?.data ||
    response?.data?.student ||
    response?.data?.user ||
    response?.data ||
    response?.student ||
    response?.user ||
    response
  );
};

export const getOneStudent = async (studentId) => {
  const res = await api.get(`/student-profile/${studentId}`);
  return res.data;
};

export const createStudentProfile = async (payload) => {
  const res = await api.post("/create-student", payload);
  return res.data;
};

export const updateStudentProfile = async (studentId, payload) => {
  const res = await api.patch(`/update-student/${studentId}`, payload);
  return res.data;
};

export const loginCommittee = async (data) => {
  const res = await api.post("/committee-login", data);
  return res.data;
};
