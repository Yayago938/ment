// src/api/interviewApi.js
import axiosInstance from "./axios";

export const createInterview = async (data) => {
  const res = await axiosInstance.post("/interview/create", data);
  return res.data;
};

export const getInterviewsByCommittee = async (committeeId) => {
  const res = await axiosInstance.get(`/interview/list/${committeeId}`);
  return res.data?.data || [];
};

export const getInterviewById = async (id) => {
  const res = await axiosInstance.get(`/interview/${id}`);
  return res.data?.data;
};

export const deleteInterview = async (id) => {
  const res = await axiosInstance.delete(`/interview/${id}`);
  return res.data;
};

export const updateInterview = async (id, data) => {
  const res = await axiosInstance.patch(`/interview/update/${id}`, data);
  return res.data;
};

export const getInterviewApplications = async (id) => {
  const res = await axiosInstance.get(`/interview/getApplications/${id}`);
  return res.data?.data || [];
};

const interviewApi = {
  // PUBLIC
  getAllInterviews: (params = {}) =>
    axiosInstance.get("/interview/all", { params }),

  getCommitteeInterviews: (committeeId, params = {}) =>
    axiosInstance.get(`/interview/list/${committeeId}`, { params }),

  getInterviewById,

  // COMMITTEE
  createInterview,

  updateInterview,

  deleteInterview,

  getInterviewApplications,

  updateApplicationStatus: (applicationId, data) =>
    axiosInstance.patch(`/interview/application/${applicationId}/status`, data),

  // STUDENT
  applyToInterview: (interviewId, data) =>
    axiosInstance.post(`/interview/${interviewId}/apply`, data),

  getMyApplications: (params = {}) =>
    axiosInstance.get("/interview/my-applications", { params }),

  // SHARED
  getApplicationById: (applicationId) =>
    axiosInstance.get(`/interview/application/${applicationId}`),
};

export default interviewApi;
