import api from "./axios";

export const getAllCommittees = () => api.get("/getAllCommittees");