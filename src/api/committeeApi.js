import api from "./axios";

export const getCommitteeById = (id) => api.get(`/committees/${id}`);
export const getCommitteeMembers = (data) => api.post("/committees/members", data);
export const getCommitteeHeads = (data) => api.post("/committees/heads", data);
export const getCommitteeEvents = (id) => api.get(`/events/committee/${id}`);