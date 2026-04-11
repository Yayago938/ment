import api from "./axios";

export const searchAll = (params) => api.get("/search", { params });
export const filterCommittee = (params) => api.get("/filter/committee", { params });
export const filterEvent = (params) => api.get("/filter/event", { params });