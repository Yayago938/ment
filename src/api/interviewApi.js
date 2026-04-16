// src/api/interviewApi.js
import axiosInstance from "./axios";

const interviewApi = {
  // PUBLIC
  getAllInterviews: (params = {}) =>
    axiosInstance.get("/interview/all", { params }),

  getCommitteeInterviews: (committeeId, params = {}) =>
    axiosInstance.get(`/interview/list/${committeeId}`, { params }),

  getInterviewById: (interviewId) =>
    axiosInstance.get(`/interview/${interviewId}`),

  // COMMITTEE
  createInterview: (data) =>
    axiosInstance.post("/interview/create", data),

  updateInterview: (interviewId, data) =>
    axiosInstance.patch(`/interview/update/${interviewId}`, data),

  deleteInterview: (interviewId) =>
    axiosInstance.delete(`/interview/${interviewId}`),

  getInterviewApplications: (interviewId, params = {}) =>
    axiosInstance.get(`/interview/${interviewId}/applications`, { params }),

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