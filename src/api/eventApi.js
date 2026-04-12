import api from "./axios";

export const createEvent = async (data) => {
  const res = await api.post("/events/createEvent", data);
  return res.data;
};

export const getAllEvents = () => api.get("/events/getAllEvents");

export const getEventById = (eventId) =>
  api.post("https://mentorlink-production.up.railway.app/events/getEvent", { eventId });
