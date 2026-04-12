import api from "./axios";

export const createEvent = async (data) => {
  const res = await api.post("/events/createEvent", data);
  return res.data;
};

export const getAllEvents = () => api.get("/events/getAllEvents");
